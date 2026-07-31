import { IsString, IsNotEmpty, IsOptional, IsNumber, IsIn } from 'class-validator';

export class CreateAdminGroupDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  rules?: string;

  @IsOptional()
  @IsString()
  rules_category?: string;

  @IsOptional()
  @IsNumber()
  @IsIn([0, 1])
  status?: number;
}