import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import { randomBytes } from 'crypto';

const REFRESH_TOKEN_EXPIRES_DAYS = 30;

@Injectable()
export class RefreshTokenService {
  private readonly logger = new Logger(RefreshTokenService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Tạo refresh token mới cho user
   */
  async createRefreshToken(userId: string, deviceInfo?: string): Promise<string> {
    // Token ngẫu nhiên 64 bytes — không phải JWT (không thể decode)
    const token = randomBytes(64).toString('hex');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS);

    await this.prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
        deviceInfo: deviceInfo ?? null,
      },
    });

    return token;
  }

  /**
   * Dùng refresh token để lấy access token mới
   */
  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const record = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!record) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }

    if (record.revokedAt) {
      // Token đã bị revoke — có thể là tấn công reuse attack
      this.logger.warn(
        `⚠️ Revoked token reuse attempt for userId: ${record.userId}`,
      );
      // Revoke toàn bộ tokens của user này (đề phòng compromise)
      await this.revokeAllUserTokens(record.userId);
      throw new UnauthorizedException('Refresh token đã bị thu hồi. Vui lòng đăng nhập lại.');
    }

    if (record.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token đã hết hạn. Vui lòng đăng nhập lại.');
    }

    // Rotate: revoke token cũ, tạo token mới (Refresh Token Rotation)
    await this.prisma.refreshToken.update({
      where: { id: record.id },
      data: { revokedAt: new Date() },
    });

    const newRefreshToken = await this.createRefreshToken(
      record.userId,
      record.deviceInfo ?? undefined,
    );

    // Tạo access token mới
    const payload = {
      email: record.user.email,
      sub: record.user.id,
      role: record.user.role,
      department: record.user.department,
      salesRole: record.user.salesRole,
      teamId: record.user.teamId,
    };

    const access_token = this.jwtService.sign(payload);

    return { access_token, refresh_token: newRefreshToken };
  }

  /**
   * Logout: revoke refresh token hiện tại
   */
  async revokeToken(token: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { token, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  /**
   * Logout tất cả devices: revoke toàn bộ tokens của user
   */
  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    this.logger.log(`Revoked all tokens for userId: ${userId}`);
  }

  /**
   * Cleanup tokens đã hết hạn (chạy định kỳ qua Cron)
   */
  async cleanupExpiredTokens(): Promise<number> {
    const result = await this.prisma.refreshToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          // Giữ revoked tokens 7 ngày cho audit, sau đó xóa
          {
            revokedAt: {
              lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        ],
      },
    });

    this.logger.log(`Cleaned up ${result.count} expired/revoked refresh tokens`);
    return result.count;
  }
}
