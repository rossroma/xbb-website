import { IsOptional, IsString, IsNumber, Min, Max, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryAdminDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  status?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  type?: number;

  @IsOptional()
  @IsString()
  @IsIn(['id_desc', 'id_asc', 'addtime_desc', 'addtime_asc'])
  sortBy?: string = 'id_desc';
}