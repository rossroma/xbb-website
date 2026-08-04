import { IsOptional, IsInt, IsString, Min, Max, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryMessageDto {
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
  @Transform(({ value }) => value !== undefined ? parseInt(value) : undefined)
  @IsInt()
  @Min(0)
  read_status?: number;

  @IsOptional()
  @Transform(({ value }) => value !== undefined ? parseInt(value) : undefined)
  @IsInt()
  @Min(0)
  check_status?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  bid?: number;

  @IsOptional()
  @IsString()
  start_date?: string;

  @IsOptional()
  @IsString()
  end_date?: string;

  @IsOptional()
  @IsString()
  @IsIn(['id_desc', 'id_asc', 'addtime_desc', 'addtime_asc'])
  sortBy?: string = 'id_desc';
}