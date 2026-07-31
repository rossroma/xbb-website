import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { MessageService } from './message.service';
import { AdminMessageController } from './admin/admin-message.controller';
import { ClientMessageController } from './client/client-message.controller';
import { Message } from './entities/message.entity';
import { DataCenterPushLog } from './entities/data-center-push-log.entity';
import { DataCenterPushService } from './services/data-center-push.service';
import { DataCenterRetryService } from './services/data-center-retry.service';
import { LogsModule } from '../logs/logs.module';
import { SmsModule } from '../sms/sms.module';
import { OperationLogInterceptor } from '../logs/interceptors/operation-log.interceptor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, DataCenterPushLog]),
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 3,
    }),
    LogsModule,
    SmsModule,
  ],
  controllers: [AdminMessageController, ClientMessageController],
  providers: [
    MessageService,
    DataCenterPushService,
    DataCenterRetryService,
    OperationLogInterceptor,
  ],
  exports: [MessageService, DataCenterPushService],
})
export class MessageModule {}