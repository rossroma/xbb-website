import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { ProfileResponseDto } from '../dto/profile-response.dto';
import { Public } from '../decorators/public.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ResponseResult } from '../../../common/interfaces/response.interface';

@Controller('v1/admin/auth')
export class AdminAuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Get('captcha')
  async getCaptcha(): Promise<ResponseResult<{ captchaId: string; image: string; expiresIn: number }>> {
    const result = this.authService.generateCaptcha();
    return ResponseResult.success(result, '获取算式成功');
  }

  // 频率限制：60 秒内最多 5 次登录尝试
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Req() req: any): Promise<ResponseResult<LoginResponseDto>> {
    const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || '';
    const result = await this.authService.login(loginDto, ip, userAgent);
    return ResponseResult.success(result, '登录成功');
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser() user: any): Promise<ResponseResult<ProfileResponseDto>> {
    const result = await this.authService.getProfile(user.id);
    return ResponseResult.success(result, '获取用户信息成功');
  }
}
