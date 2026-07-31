import { IsNotEmpty, IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty({ message: '标题不能为空' })
  @IsString({ message: '标题必须是字符串' })
  title: string;

  @IsOptional()
  @IsString({ message: '英文名称必须是字符串' })
  title_en?: string;

  @IsOptional()
  @IsString({ message: '副标题必须是字符串' })
  subtitle?: string;

  @IsOptional()
  @IsNumber({}, { message: '栏目ID必须是数字' })
  bid?: number;

  @IsOptional()
  @IsString({ message: '推荐标识必须是字符串' })
  flag?: string;

  @IsOptional()
  @IsString({ message: '缩略图必须是字符串' })
  simg?: string;

  @IsOptional()
  @IsNumber({}, { message: '排序必须是数字' })
  @Min(0, { message: '排序不能小于0' })
  ord?: number;

  @IsOptional()
  @IsString({ message: '作者必须是字符串' })
  author?: string;

  @IsOptional()
  @IsString({ message: '来源必须是字符串' })
  source?: string;

  @IsOptional()
  @IsString({ message: '描述必须是字符串' })
  descs?: string;

  @IsOptional()
  @IsString({ message: '内容必须是字符串' })
  content?: string;

  @IsOptional()
  @IsString({ message: 'SEO标题必须是字符串' })
  seoTitle?: string;

  @IsOptional()
  @IsString({ message: 'SEO关键词必须是字符串' })
  seoKeyword?: string;

  @IsOptional()
  @IsString({ message: 'SEO描述必须是字符串' })
  setDescription?: string;

  @IsOptional()
  @IsNumber({}, { message: '状态必须是数字' })
  @Min(-1, { message: '状态值不正确' })
  @Max(1, { message: '状态值不正确' })
  status?: number;
}