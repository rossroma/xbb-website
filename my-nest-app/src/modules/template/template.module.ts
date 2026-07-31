import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateService } from './template.service';
import { AdminTemplateController } from './admin/admin-template.controller';
import { ClientTemplateController } from './client/client-template.controller';
import { ClientPageController } from './client/client-page.controller';
import { Template } from './entities/template.entity';
import { ArticleModule } from '../article/article.module';
import { CategoryModule } from '../category/category.module';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Template]),
    ArticleModule,
    CategoryModule,
    SettingsModule,
  ],
  controllers: [AdminTemplateController, ClientTemplateController, ClientPageController],
  providers: [TemplateService],
  exports: [TemplateService],
})
export class TemplateModule { }