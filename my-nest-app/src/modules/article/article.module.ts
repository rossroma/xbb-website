import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleService } from './article.service';
import { AdminArticleController } from './admin/admin-article.controller';
import { ClientArticleController } from './client/client-article.controller';
import { Article } from './entities/article.entity';
import { LogsModule } from '../logs/logs.module';
import { OperationLogInterceptor } from '../logs/interceptors/operation-log.interceptor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article]),
    LogsModule,
  ],
  controllers: [AdminArticleController, ClientArticleController],
  providers: [ArticleService, OperationLogInterceptor],
  exports: [ArticleService],
})
export class ArticleModule { }