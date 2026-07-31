import { IsString, MinLength, MaxLength } from 'class-validator';

export class ReplyMessageDto {
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  reply_content: string;
}