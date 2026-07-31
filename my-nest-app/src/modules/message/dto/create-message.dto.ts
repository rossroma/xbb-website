import { IsString, IsOptional, IsEmail, IsInt, MaxLength, MinLength } from 'class-validator';

export class CreateMessageDto {
  @IsOptional()
  @IsInt()
  bid?: number;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  mname: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  address?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  tel: string;

  @IsOptional()
  @IsInt()
  source_tid?: number;

  @IsOptional()
  @IsEmail()
  @MaxLength(30)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5)
  age?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  descs?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  content: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  source?: string;

  @IsOptional()
  @IsInt()
  article_id?: number;

  @IsOptional()
  @IsInt()
  article_score?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  scale?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  industry?: string;
}