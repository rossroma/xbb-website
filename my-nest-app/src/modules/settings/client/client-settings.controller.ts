import { Controller, Get } from '@nestjs/common';
import { Public } from '../../auth/decorators/public.decorator';
import { SettingsService } from '../settings.service';

@Controller('v1/client')
@Public()
export class ClientSettingsController {
  constructor(private readonly settingsService: SettingsService) { }

  @Get('site-info')
  getSiteInfo() {
    return this.settingsService.getSiteInfo();
  }
}
