import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { AdminCategoryController } from './admin/admin-category.controller';
import { ClientCategoryController } from './client/client-category.controller';
import { Category } from './entities/category.entity';
import { LogsModule } from '../logs/logs.module';
import { OperationLogInterceptor } from '../logs/interceptors/operation-log.interceptor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    LogsModule,
  ],
  controllers: [AdminCategoryController, ClientCategoryController],
  providers: [CategoryService, OperationLogInterceptor],
  exports: [CategoryService],
})
export class CategoryModule { }