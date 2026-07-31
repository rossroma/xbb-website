import { IsString, IsOptional } from 'class-validator';

export class UpdateBaseDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsString()
  descs?: string;

  @IsOptional()
  @IsString()
  QQ?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  content2?: string;

  @IsOptional()
  @IsString()
  QQName?: string;

  @IsOptional()
  @IsString()
  isQQ?: string;

  @IsOptional()
  @IsString()
  hot_kwd?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  wap_logo?: string;

  @IsOptional()
  @IsString()
  ico_logo?: string;

  @IsOptional()
  @IsString()
  tel?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  video?: string;

  @IsOptional()
  @IsString()
  toolscode_bottom?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  fax?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  postcode?: string;

  @IsOptional()
  @IsString()
  hot_online?: string;

  @IsOptional()
  @IsString()
  download?: string;

  @IsOptional()
  @IsString()
  toolscode_top?: string;

  @IsOptional()
  @IsString()
  wap_content?: string;

  @IsOptional()
  @IsString()
  keyreplace?: string;

  @IsOptional()
  @IsString()
  send_email?: string;

  @IsOptional()
  @IsString()
  weibo_simg?: string;

  @IsOptional()
  @IsString()
  weixin_simg?: string;

  @IsOptional()
  @IsString()
  douyin_simg?: string;

  @IsOptional()
  @IsString()
  wxurl?: string;

  @IsOptional()
  @IsString()
  wxappid?: string;

  @IsOptional()
  @IsString()
  wxappsecret?: string;
}
