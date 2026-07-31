import { IsString, IsInt, IsOptional, Min } from 'class-validator';

export class CreateAdsDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsString()
  descs?: string;

  @IsInt()
  @Min(1)
  bid: number;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  ord?: number;

  @IsOptional()
  @IsString()
  simg?: string;

  @IsOptional()
  @IsString()
  simg2?: string;

  @IsOptional()
  @IsString()
  wap_simg?: string;

  @IsOptional()
  @IsString()
  width_height?: string;

  @IsOptional()
  @IsString()
  download?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  target?: string;
}
