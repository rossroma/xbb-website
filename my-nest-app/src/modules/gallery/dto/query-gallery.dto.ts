import { IsOptional, IsString, IsInt, IsIn, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryGalleryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @Transform(({ value }) => value === '' || value === undefined || value === null ? undefined : parseInt(value))
  @IsInt()
  bid?: number;

  @IsOptional()
  @IsString()
  @IsIn(['id', 'ord', 'addtime', 'title', 'bid'], { message: '排序字段不正确' })
  sort?: string = 'ord';

  @IsOptional()
  @IsString()
  order?: 'ASC' | 'DESC' = 'ASC';
}