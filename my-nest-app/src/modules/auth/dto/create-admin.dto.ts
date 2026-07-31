import { IsString, IsNotEmpty, IsOptional, IsNumber, IsIn } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsNumber()
  @IsIn([0, 1])
  status?: number;

  @IsOptional()
  @IsNumber()
  @IsIn([0, 1])
  type?: number;

  @IsOptional()
  @IsNumber()
  group_id?: number;
}