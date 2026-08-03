import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsService } from './logs.service';
import { OperationLogInterceptor } from './interceptors/operation-log.interceptor';
import { AdminLogsController } from './admin/admin-logs.controller';
import { OperationLog } from './entities/operation-log.entity';
import { LoginLog } from './entities/login-log.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([OperationLog, LoginLog])],
  controllers: [AdminLogsController],
  providers: [LogsService, OperationLogInterceptor],
  exports: [LogsService, OperationLogInterceptor],
})
export class LogsModule {}