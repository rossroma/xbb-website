import { PartialType } from '@nestjs/mapped-types';
import { CreateAdsDto } from './create-ads.dto';

export class UpdateAdsDto extends PartialType(CreateAdsDto) { }
