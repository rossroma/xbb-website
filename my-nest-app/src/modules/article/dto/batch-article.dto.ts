import { IsArray, IsNumber, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class BatchArticleDto {
  @IsArray({ message: 'ids 必须是数组' })
  @ArrayNotEmpty({ message: 'ids 不能为空' })
  @Type(() => Number)
  @IsNumber({}, { each: true, message: '每个 id 必须是数字' })
  ids: number[];
}