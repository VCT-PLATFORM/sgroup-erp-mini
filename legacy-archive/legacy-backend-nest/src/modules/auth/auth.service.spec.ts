import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { USER_REPOSITORY } from '../../common/database/repository-tokens';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { RefreshTokenService } from './services/refresh-token.service';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

// ─── Mocks ─────────────────────────────────────────────────────────────────

const mockUser = {
  id: 'user-uuid-1',
  email: 'admin@sgroup.vn',
  name: 'Admin SGROUP',
  password: bcrypt.hashSync('StrongP@ss123', 10),
  role: 'admin',
  department: 'MANAGEMENT',
  salesRole: null,
  teamId: null,
};

const mockUserRepo = {
  findByEmail: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock.jwt.token'),
};

const mockPrismaService = {
  salesTeam: { findUnique: jest.fn() },
};

const mockRefreshTokenService = {
  createRefreshToken: jest.fn().mockResolvedValue('mock-refresh-token-hex'),
  revokeToken: jest.fn(),
  revokeAllUserTokens: jest.fn(),
  refreshAccessToken: jest.fn(),
};

// ─── Tests ─────────────────────────────────────────────────────────────────

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: USER_REPOSITORY, useValue: mockUserRepo },
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: RefreshTokenService, useValue: mockRefreshTokenService },
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ── Login ─────────────────────────────────────────────────────────────────

  describe('login()', () => {
    it('nên login thành công với credentials đúng', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(mockUser);
      mockRefreshTokenService.createRefreshToken.mockResolvedValue('refresh-token');

      const result = await service.login('admin@sgroup.vn', 'StrongP@ss123');

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(result.user.email).toBe('admin@sgroup.vn');
      expect(result.user).not.toHaveProperty('password'); // Không trả password
    });

    it('nên throw UnauthorizedException khi email không tồn tại', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);

      await expect(service.login('notfound@test.com', 'anypass')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('nên throw UnauthorizedException khi password sai', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(mockUser);

      await expect(service.login('admin@sgroup.vn', 'WrongPass')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('SECURITY: không nên cho phép login bằng plaintext password', async () => {
      // Giả lập user có password là plaintext (chưa hash)
      const plainUser = { ...mockUser, password: 'plaintext123' };
      mockUserRepo.findByEmail.mockResolvedValue(plainUser);

      // bcrypt.compare('plaintext123', 'plaintext123') → false (vì 'plaintext123' không phải bcrypt hash)
      await expect(service.login('admin@sgroup.vn', 'plaintext123')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('SECURITY: message lỗi không tiết lộ email có tồn tại hay không', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);

      try {
        await service.login('notexist@test.com', 'pass');
        fail('Expected to throw');
      } catch (e) {
        expect(e.message).toBe('Email hoặc mật khẩu không chính xác');
        // Không được nói "Email không tồn tại" — lộ user enumeration
        expect(e.message).not.toContain('tồn tại');
      }
    });
  });

  // ── Register ──────────────────────────────────────────────────────────────

  describe('registerMockDev()', () => {
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
    });

    it('nên throw ForbiddenException trên production', async () => {
      process.env.NODE_ENV = 'production';

      await expect(
        service.registerMockDev({ email: 'test@test.com', name: 'Test', password: 'StrongPass1' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('nên throw ForbiddenException nếu password < 8 ký tự', async () => {
      process.env.NODE_ENV = 'development';

      await expect(
        service.registerMockDev({ email: 'test@test.com', name: 'Test', password: '1234567' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('nên tạo user với password đã hash trong dev', async () => {
      process.env.NODE_ENV = 'development';
      mockUserRepo.create.mockResolvedValue({ id: 'new-id', email: 'test@test.com' });

      const result = await service.registerMockDev({
        email: 'test@test.com',
        name: 'Test User',
        password: 'StrongPass1!',
      });

      expect(result).toBeDefined();
      // Kiểm tra create được gọi với password đã hash (không phải plaintext)
      const createCall = mockUserRepo.create.mock.calls[0][0];
      expect(createCall.password).not.toBe('StrongPass1!');
      expect(createCall.password).toMatch(/^\$2[ab]\$/); // bcrypt hash pattern
    });
  });

  // ── Change Password ───────────────────────────────────────────────────────

  describe('changePassword()', () => {
    it('nên đổi password thành công', async () => {
      mockUserRepo.findById.mockResolvedValue(mockUser);
      mockUserRepo.update.mockResolvedValue({});

      const result = await service.changePassword(
        'user-uuid-1',
        'StrongP@ss123',
        'NewStrongPass!1',
      );

      expect(result.message).toBe('Đổi mật khẩu thành công');
    });

    it('nên throw UnauthorizedException khi current password sai', async () => {
      mockUserRepo.findById.mockResolvedValue(mockUser);

      await expect(
        service.changePassword('user-uuid-1', 'WrongOldPass', 'NewPass!1'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('nên throw ForbiddenException nếu new password < 8 ký tự', async () => {
      mockUserRepo.findById.mockResolvedValue(mockUser);

      await expect(
        service.changePassword('user-uuid-1', 'StrongP@ss123', '1234567'),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
