import { IsOptional, IsString, IsNumber, Min, Max, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryArticleDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '页码必须是数字' })
  @Min(1, { message: '页码不能小于1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '每页数量必须是数字' })
  @Min(1, { message: '每页数量不能小于1' })
  @Max(100, { message: '每页数量不能超过100' })
  limit?: number = 10;

  @IsOptional()
  @IsString({ message: '标题搜索必须是字符串' })
  title?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '栏目ID必须是数字' })
  bid?: number;

  @IsOptional()
  @IsString({ message: '多栏目ID必须是字符串（逗号分隔）' })
  bids?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '状态必须是数字' })
  status?: number;

  @IsOptional()
  @IsString({ message: '作者搜索必须是字符串' })
  author?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '推荐筛选必须是数字' })
  @IsIn([0, 1], { message: '推荐筛选只能是0或1' })
  isRecommended?: number;

  @IsOptional()
  @IsString({ message: '排序方式必须是字符串' })
  @IsIn(['addtime_desc', 'addtime_asc', 'hit_desc', 'hit_asc', 'ord_asc', 'ord_desc'],
    { message: '排序方式不正确' })
  sortBy?: string = 'addtime_desc';
}