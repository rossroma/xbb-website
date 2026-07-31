import { IsString, IsInt, IsOptional, Min } from 'class-validator';

export class CreateAdsTypeDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  width_height?: string;

  @IsOptional()
  @IsString()
  wap_width_height?: string;

  @IsOptional()
  @IsString()
  simg2_width_height?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  ord?: number;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  wap_content?: string;

  @IsOptional()
  @IsInt()
  is_img?: number;

  @IsOptional()
  @IsInt()
  is_img2?: number;

  @IsOptional()
  @IsInt()
  is_img_wap?: number;

  @IsOptional()
  @IsInt()
  is_download?: number;

  @IsOptional()
  @IsInt()
  is_descs?: number;

  @IsOptional()
  @IsInt()
  is_url?: number;

  @IsOptional()
  @IsInt()
  is_subtitle?: number;

  @IsOptional()
  @IsInt()
  is_content?: number;

  @IsOptional()
  @IsInt()
  is_show?: number;
}
