import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ads } from './entities/ads.entity';
import { AdsType } from './entities/ads-type.entity';
import { AdsService } from './ads.service';
import { AdminAdsController } from './admin/admin-ads.controller';
import { AdminAdsTypeController } from './admin/admin-ads-type.controller';
import { ClientAdsController } from './client/client-ads.controller';
import { LogsModule } from '../logs/logs.module';
import { OperationLogInterceptor } from '../logs/interceptors/operation-log.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([Ads, AdsType]), LogsModule],
  controllers: [
    AdminAdsController,
    AdminAdsTypeController,
    ClientAdsController,
  ],
  providers: [AdsService, OperationLogInterceptor],
  exports: [AdsService],
})
export class AdsModule { }
