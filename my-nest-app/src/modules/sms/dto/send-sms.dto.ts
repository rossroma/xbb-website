import { IsString, Matches, Length } from 'class-validator';

/**
 * 发送短信验证码请求 DTO
 */
export class SendSmsDto {
  @IsString({ message: '手机号不能为空' })
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  tel: string;

  @IsString({ message: '算式结果不能为空' })
  @Length(1, 3, { message: '请输入算式结果' })
  captcha: string;

  /** 算式验证 JWT Token（包含算式结果 + 有效期，用于防篡改校验） */
  @IsString({ message: '验证令牌不能为空' })
  token: string;
}