import { IsOptional, IsInt, IsString, Min, Max, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * 短信发送日志查询 DTO
 */
export class QuerySmsLogDto {
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

  /** 手机号模糊搜索 */
  @IsOptional()
  @IsString()
  phone?: string;

  /** 发送状态：success / failed */
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  @IsIn(['success', 'failed'])
  status?: string;

  /** 开始日期 (YYYY-MM-DD) */
  @IsOptional()
  @IsString()
  start_date?: string;

  /** 结束日期 (YYYY-MM-DD) */
  @IsOptional()
  @IsString()
  end_date?: string;

  /** 排序方式 */
  @IsOptional()
  @IsString()
  @IsIn(['created_at_desc', 'created_at_asc'])
  sortBy?: string = 'created_at_desc';
}