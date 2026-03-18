import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  Inject,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { USER_REPOSITORY } from '../../common/database/repository-tokens';
import { IUserRepository } from '../../common/database/entity-repositories';
import { PrismaService } from '../../prisma/prisma.service';
import { RefreshTokenService } from './services/refresh-token.service';
import * as bcrypt from 'bcrypt';

const BCRYPT_ROUNDS = 12;
const DEFAULT_MAX_LOGIN_ATTEMPTS = 5;
const DEFAULT_LOCK_MINUTES = 30;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(USER_REPOSITORY) private userRepo: IUserRepository,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  /** Get max login attempts from system settings, fallback to default */
  private async getMaxLoginAttempts(): Promise<number> {
    try {
      const setting = await this.prisma.systemSetting.findUnique({ where: { key: 'max_login_attempts' } });
      return setting ? parseInt(setting.value) || DEFAULT_MAX_LOGIN_ATTEMPTS : DEFAULT_MAX_LOGIN_ATTEMPTS;
    } catch {
      return DEFAULT_MAX_LOGIN_ATTEMPTS;
    }
  }

  /** Get lock duration from system settings, fallback to default */
  private async getLockMinutes(): Promise<number> {
    try {
      const setting = await this.prisma.systemSetting.findUnique({ where: { key: 'account_lock_minutes' } });
      return setting ? parseInt(setting.value) || DEFAULT_LOCK_MINUTES : DEFAULT_LOCK_MINUTES;
    } catch {
      return DEFAULT_LOCK_MINUTES;
    }
  }

  async login(email: string, pass: string, deviceInfo?: string) {
    // SECURITY: Tránh timing attack — luôn so sánh bcrypt dù user không tồn tại
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      // Chạy bcrypt dummy để tránh timing-based user enumeration
      await bcrypt.compare(pass, '$2b$12$dummyhashtopreventtimingattacks0000000000');
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    // Check if account is locked
    if ((user as any).lockedUntil && new Date((user as any).lockedUntil) > new Date()) {
      const lockedUntil = new Date((user as any).lockedUntil);
      const minutesLeft = Math.ceil((lockedUntil.getTime() - Date.now()) / 60000);
      this.logger.warn(`Login blocked for locked account: ${email} (${minutesLeft} min remaining)`);
      throw new ForbiddenException(
        `Tài khoản đã bị khóa tạm thời. Vui lòng thử lại sau ${minutesLeft} phút.`,
      );
    }

    // Check if account is deactivated
    if (!(user as any).isActive) {
      throw new ForbiddenException('Tài khoản đã bị vô hiệu hóa. Liên hệ quản trị viên.');
    }

    // SECURITY: CHỈ so sánh bcrypt — KHÔNG fallback plaintext bất kỳ hoàn cảnh nào
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      this.logger.warn(`Login failed for email: ${email}`);

      // Increment failed attempts and potentially lock account
      const currentAttempts = ((user as any).failedLoginAttempts || 0) + 1;
      const maxAttempts = await this.getMaxLoginAttempts();

      if (currentAttempts >= maxAttempts) {
        const lockMinutes = await this.getLockMinutes();
        const lockedUntil = new Date(Date.now() + lockMinutes * 60 * 1000);
        await this.prisma.user.update({
          where: { id: user.id },
          data: { failedLoginAttempts: currentAttempts, lockedUntil },
        });
        this.logger.warn(`Account locked: ${email} after ${currentAttempts} failed attempts (locked for ${lockMinutes} min)`);
        throw new ForbiddenException(
          `Tài khoản đã bị khóa sau ${maxAttempts} lần đăng nhập thất bại. Tự động mở khóa sau ${lockMinutes} phút.`,
        );
      } else {
        await this.prisma.user.update({
          where: { id: user.id },
          data: { failedLoginAttempts: currentAttempts },
        });
      }

      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    // Login successful — reset failed attempts & update tracking
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        loginCount: { increment: 1 },
      },
    });

    // Lấy tên team nếu user thuộc sales team
    let teamName: string | null = null;
    if (user.teamId) {
      try {
        const team = await this.prisma.salesTeam.findUnique({
          where: { id: user.teamId },
          select: { name: true },
        });
        teamName = team?.name ?? null;
      } catch {
        /* team lookup optional — không block login */
      }
    }

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      department: user.department,
      salesRole: user.salesRole,
      teamId: user.teamId,
    };

    // Tạo cặp access token (short-lived) + refresh token (long-lived)
    const access_token = this.jwtService.sign(payload);
    const refresh_token = await this.refreshTokenService.createRefreshToken(
      user.id,
      deviceInfo,
    );

    this.logger.log(`Login success: ${email} (role=${user.role})`);

    return {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        salesRole: user.salesRole,
        teamId: user.teamId,
        teamName,
      },
    };
  }

  /** Đổi access token bằng refresh token hợp lệ */
  async refreshTokens(refreshToken: string) {
    return this.refreshTokenService.refreshAccessToken(refreshToken);
  }

  /** Logout — revoke refresh token hiện tại */
  async logout(refreshToken: string): Promise<void> {
    await this.refreshTokenService.revokeToken(refreshToken);
  }

  /** Logout khỏi tất cả thiết bị */
  async logoutAll(userId: string): Promise<void> {
    await this.refreshTokenService.revokeAllUserTokens(userId);
  }

  /**
   * Tạo user mới — CHỈ DÙNG trong môi trường development.
   * Production: endpoint này được bảo vệ bởi @Roles('admin') ở controller.
   */
  async registerMockDev(data: {
    email: string;
    name: string;
    password?: string;
    role?: string;
  }) {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException(
        'Endpoint này không khả dụng trong môi trường production',
      );
    }

    if (!data.password || data.password.length < 8) {
      throw new ForbiddenException(
        'Mật khẩu phải có ít nhất 8 ký tự',
      );
    }

    const hashed = await bcrypt.hash(data.password, BCRYPT_ROUNDS);

    return this.userRepo.create({
      email: data.email,
      name: data.name,
      role: data.role || 'employee',
      password: hashed,
    } as any);
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Không tìm thấy tài khoản');
    }

    // SECURITY: CHỈ bcrypt compare — KHÔNG fallback plaintext
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Mật khẩu hiện tại không chính xác');
    }

    if (newPassword.length < 8) {
      throw new ForbiddenException('Mật khẩu mới phải có ít nhất 8 ký tự');
    }

    const hashed = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await this.userRepo.update(userId, { password: hashed } as any);

    // Track password change timestamp
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordChangedAt: new Date() },
    }).catch(() => {});

    this.logger.log(`Password changed for userId: ${userId}`);
    return { message: 'Đổi mật khẩu thành công' };
  }
}
