import { IsString, IsOptional, IsInt, IsIn, Min, Max } from 'class-validator';

export class CreateTemplateDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  @IsIn(['page', 'list'])
  type?: string = 'page';

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsString()
  category_remarks?: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  descs?: string;

  @IsOptional()
  @IsString()
  template_name?: string;

  @IsOptional()
  @IsString()
  simg?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1)
  status?: number = 1;

  @IsOptional()
  @IsString()
  attribute_type?: string;

  @IsOptional()
  @IsString()
  attribute?: string;
}