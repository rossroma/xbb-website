import { IsString, Matches, Length } from 'class-validator';

/**
 * 验证短信验证码请求 DTO
 */
export class VerifySmsDto {
  @IsString({ message: '手机号不能为空' })
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  tel: string;

  @IsString({ message: '验证码不能为空' })
  @Length(6, 6, { message: '请输入6位短信验证码' })
  code: string;
}