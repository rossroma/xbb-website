import { IsString, IsOptional, IsNumber, IsInt, Min } from 'class-validator';

export class CreateGalleryDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  bid?: number;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsString()
  simg?: string;

  @IsOptional()
  @IsString()
  simg2?: string;

  @IsOptional()
  @IsString()
  descs?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  ord?: number;

  @IsOptional()
  @IsString()
  content?: string;
}