import { IsOptional, IsInt, Min, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryAdsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  bid?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  position?: number;

  @IsOptional()
  @IsString()
  @IsIn(['id_desc', 'id_asc', 'ord_asc', 'ord_desc'])
  sortBy?: string = 'id_desc';
}
