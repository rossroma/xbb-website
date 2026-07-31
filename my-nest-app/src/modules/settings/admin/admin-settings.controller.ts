import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SettingsService } from '../settings.service';
import { UpdateBaseDto } from '../dto/update-base.dto';
import { UpdateSettingDto } from '../dto/update-setting.dto';

@Controller('v1/admin/settings')
@UseGuards(JwtAuthGuard)
export class AdminSettingsController {
  constructor(private readonly settingsService: SettingsService) { }

  @Get()
  getAllSettings() {
    return this.settingsService.getAllSettings();
  }

  @Put()
  updateAllSettings(
    @Body() body: { base?: UpdateBaseDto; setting?: UpdateSettingDto },
  ) {
    return this.settingsService.updateAllSettings(
      body.base || {},
      body.setting || {},
    );
  }

  @Get('base')
  getBase() {
    return this.settingsService.getBase();
  }

  @Put('base')
  updateBase(@Body() updateBaseDto: UpdateBaseDto) {
    return this.settingsService.updateBase(updateBaseDto);
  }

  @Get('setting')
  getSetting() {
    return this.settingsService.getSetting();
  }

  @Put('setting')
  updateSetting(@Body() updateSettingDto: UpdateSettingDto) {
    return this.settingsService.updateSetting(updateSettingDto);
  }
}
