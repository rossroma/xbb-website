import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Headers,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { SmsService } from './sms.service';
import { SendSmsDto } from './dto/send-sms.dto';
import { VerifySmsDto } from './dto/verify-sms.dto';
import { Public } from '../auth/decorators/public.decorator';

/**
 * 短信服务客户端控制器
 * 路由前缀: /v1/client/sms
 */
@Controller('v1/client/sms')
@Public()
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  /**
   * 获取算式验证码
   * GET /v1/client/sms/captcha
   *
   * 返回 JWT Token + SVG 字符串（数学算式），算式结果签名在 Token 中，无状态校验
   */
  @Get('captcha')
  async getCaptcha() {
    const { svg, text } = this.smsService.generateCaptcha();
    const token = this.smsService.createCaptchaToken(text);

    return { token, svg };
  }

  /**
   * 发送短信验证码
   * POST /v1/client/sms/send
   *
   * 频率限制：60 秒内同一 IP 最多 3 次
   */
  @Post('send')
  @Throttle({ default: { ttl: 60000, limit: 3 } })
  async sendSms(
    @Body() dto: SendSmsDto,
    @Req() req: Request,
    @Headers('x-forwarded-for') forwardedFor: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const clientIp = this.getClientIp(req, forwardedFor);
    return await this.smsService.sendSms(dto.tel, dto.captcha, dto.token, clientIp, userAgent);
  }

  /**
   * 校验短信验证码
   * POST /v1/client/sms/verify
   */
  @Post('verify')
  async verifySms(@Body() dto: VerifySmsDto) {
    return await this.smsService.verifyCode(dto.tel, dto.code);
  }

  /**
   * 获取真实客户端 IP
   */
  private getClientIp(req: Request, forwardedFor?: string): string {
    if (forwardedFor) {
      const firstIp = forwardedFor.split(',')[0].trim();
      if (firstIp) return firstIp;
    }
    return (req as any).ip || req.socket?.remoteAddress || '127.0.0.1';
  }
}