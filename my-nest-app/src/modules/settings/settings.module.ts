import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Base } from './entities/base.entity';
import { Setting } from './entities/setting.entity';
import { SettingsService } from './settings.service';
import { AdminSettingsController } from './admin/admin-settings.controller';
import { ClientSettingsController } from './client/client-settings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Base, Setting])],
  controllers: [AdminSettingsController, ClientSettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule { }
