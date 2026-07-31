import { PartialType } from '@nestjs/mapped-types';
import { CreateShowInfoDto } from './create-show-info.dto';

export class UpdateShowInfoDto extends PartialType(CreateShowInfoDto) { }