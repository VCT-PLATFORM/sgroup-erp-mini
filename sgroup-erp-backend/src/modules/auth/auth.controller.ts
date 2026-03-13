import {
  Controller,
  Post,
  Patch,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Đăng nhập — trả về access_token (short) + refresh_token (long)
   */
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập hệ thống' })
  login(
    @Body() body: { email: string; password: string },
    @Headers('user-agent') userAgent?: string,
  ) {
    return this.authService.login(body.email, body.password, userAgent);
  }

  /**
   * Lấy access token mới bằng refresh token (không cần đăng nhập lại)
   * Áp dụng Refresh Token Rotation: mỗi lần dùng sẽ tạo refresh token mới
   */
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiOperation({ summary: 'Làm mới access token bằng refresh token' })
  refresh(@Body() body: { refresh_token: string }) {
    return this.authService.refreshTokens(body.refresh_token);
  }

  /**
   * Logout — revoke refresh token hiện tại (access token tự hết hạn)
   */
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @ApiOperation({ summary: 'Đăng xuất (revoke refresh token)' })
  logout(@Body() body: { refresh_token: string }) {
    return this.authService.logout(body.refresh_token);
  }

  /**
   * Logout tất cả thiết bị — revoke toàn bộ refresh tokens của user
   */
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Post('logout-all')
  @ApiOperation({ summary: 'Đăng xuất khỏi tất cả thiết bị' })
  logoutAll(@Req() req: any) {
    return this.authService.logoutAll(req.user.id);
  }

  /**
   * Tạo user mới — CHỈ DÀNH CHO ADMIN + CHỈ TRONG DEVELOPMENT
   * SECURITY: Đã xóa @Public() + AuthService double-guard trong production
   */
  @ApiBearerAuth()
  @Roles('admin')
  @Post('register')
  @ApiOperation({
    summary: '[Dev only] Tạo user mới',
    description: 'Chỉ admin. Chỉ hoạt động trong môi trường development.',
  })
  register(
    @Body()
    body: {
      email: string;
      name: string;
      password: string;
      role?: string;
    },
  ) {
    return this.authService.registerMockDev(body);
  }

  /**
   * Đổi mật khẩu — yêu cầu JWT của chính user đó
   */
  @ApiBearerAuth()
  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đổi mật khẩu tài khoản hiện tại' })
  changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(
      req.user.id,
      dto.currentPassword,
      dto.newPassword,
    );
  }
}
