import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { CreateMessageDto } from './create-message.dto';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(2)
  check_status?: number; // 0未审核，1已审核，2已拒绝

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1)
  read_status?: number; // 0未读，1已读
}