import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { Public } from '../../auth/decorators/public.decorator';
import { AdsService } from '../ads.service';

@Controller('v1/client/ads')
@Public()
export class ClientAdsController {
  constructor(private readonly adsService: AdsService) { }

  @Get()
  findByPosition(@Query('position', ParseIntPipe) position: number) {
    return this.adsService.findAdsByPosition(position);
  }
}
