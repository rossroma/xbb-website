import { IsInt, IsString, IsOptional } from 'class-validator';

export class UpdateSettingDto {
  @IsOptional()
  @IsInt()
  is_banner?: number;

  @IsOptional()
  @IsInt()
  is_banner_url?: number;

  @IsOptional()
  @IsInt()
  is_english_open?: number;

  @IsOptional()
  @IsInt()
  is_wap_open?: number;

  @IsOptional()
  @IsInt()
  is_wap_banner?: number;

  @IsOptional()
  @IsInt()
  is_wap_banner_url?: number;

  @IsOptional()
  @IsInt()
  is_keyreplace?: number;

  @IsOptional()
  @IsInt()
  is_tags?: number;

  @IsOptional()
  @IsInt()
  is_open_cache?: number;

  @IsOptional()
  @IsInt()
  is_open_close?: number;

  @IsOptional()
  @IsString()
  logo_size?: string;

  @IsOptional()
  @IsString()
  banner_size?: string;

  @IsOptional()
  @IsString()
  wap_banner_size?: string;

  @IsOptional()
  @IsString()
  show_imgs_size?: string;
}
