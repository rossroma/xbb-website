import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { SettingsService } from '../settings.service';
import { UpdateBaseDto } from '../dto/update-base.dto';
import { UpdateSettingDto } from '../dto/update-setting.dto';

@Controller('v1/admin/settings')
@UseGuards(JwtAuthGuard)
export class AdminSettingsController {
  constructor(private readonly settingsService: SettingsService) { }

  @Get()
  @RequirePermissions('settings_manage.view')
  getAllSettings() {
    return this.settingsService.getAllSettings();
  }

  @Put()
  @RequirePermissions('settings_manage.edit')
  updateAllSettings(
    @Body() body: { base?: UpdateBaseDto; setting?: UpdateSettingDto },
  ) {
    return this.settingsService.updateAllSettings(
      body.base || {},
      body.setting || {},
    );
  }

  @Get('base')
  @RequirePermissions('settings_manage.view')
  getBase() {
    return this.settingsService.getBase();
  }

  @Put('base')
  @RequirePermissions('settings_manage.edit')
  updateBase(@Body() updateBaseDto: UpdateBaseDto) {
    return this.settingsService.updateBase(updateBaseDto);
  }

  @Get('setting')
  @RequirePermissions('settings_manage.view')
  getSetting() {
    return this.settingsService.getSetting();
  }

  @Put('setting')
  @RequirePermissions('settings_manage.edit')
  updateSetting(@Body() updateSettingDto: UpdateSettingDto) {
    return this.settingsService.updateSetting(updateSettingDto);
  }
}
