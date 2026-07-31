import { IsNotEmpty, IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: '栏目名称不能为空' })
  @IsString({ message: '栏目名称必须是字符串' })
  title: string;

  @IsOptional()
  @IsString({ message: '英文名称必须是字符串' })
  english?: string;

  @IsOptional()
  @IsString({ message: '英文标题必须是字符串' })
  title_en?: string;

  @IsOptional()
  @IsString({ message: '副标题必须是字符串' })
  subtitle?: string;

  @IsOptional()
  @IsNumber({}, { message: '父级ID必须是数字' })
  @Min(0, { message: '父级ID不能小于0' })
  pid?: number;

  @IsOptional()
  @IsString({ message: '栏目类型必须是字符串' })
  type?: string;

  @IsOptional()
  @IsString({ message: '导航链接必须是字符串' })
  link?: string;

  @IsOptional()
  @IsString({ message: '外链地址必须是字符串' })
  link_out?: string;

  @IsOptional()
  @IsNumber({}, { message: '分页数量必须是数字' })
  @Min(1, { message: '分页数量不能小于1' })
  pagesize?: number;

  @IsOptional()
  @IsString({ message: '列表页模板必须是字符串' })
  template_list?: string;

  @IsOptional()
  @IsString({ message: '详情页模板必须是字符串' })
  template_view?: string;

  @IsOptional()
  @IsNumber({}, { message: '排序必须是数字' })
  @Min(0, { message: '排序不能小于0' })
  ord?: number;

  @IsOptional()
  @IsNumber({}, { message: '导航显示必须是数字' })
  @Min(0, { message: '导航显示值不正确' })
  @Max(1, { message: '导航显示值不正确' })
  is_nav?: number;

  @IsOptional()
  @IsNumber({}, { message: '是否允许添加下级必须是数字' })
  @Min(0, { message: '是否允许添加下级值不正确' })
  @Max(1, { message: '是否允许添加下级值不正确' })
  is_lower?: number;

  @IsOptional()
  @IsNumber({}, { message: '是否允许删除必须是数字' })
  @Min(0, { message: '是否允许删除值不正确' })
  @Max(1, { message: '是否允许删除值不正确' })
  is_delete?: number;

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
  @IsString({ message: '缩略图必须是字符串' })
  simg?: string;

  @IsOptional()
  @IsString({ message: 'PC Banner必须是字符串' })
  banner?: string;

  @IsOptional()
  @IsString({ message: '手机 Banner必须是字符串' })
  wap_banner?: string;

  @IsOptional()
  @IsString({ message: '描述必须是字符串' })
  descs?: string;

  @IsOptional()
  @IsString({ message: '内容必须是字符串' })
  content?: string;

  @IsOptional()
  @IsString({ message: '附加内容必须是字符串' })
  content2?: string;

  @IsOptional()
  @IsNumber({}, { message: '状态必须是数字' })
  @Min(0, { message: '状态值不正确' })
  @Max(1, { message: '状态值不正确' })
  status?: number;
}
