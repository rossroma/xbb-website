import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from '../article/entities/article.entity';
import { Case } from '../case/entities/case.entity';
import { SsrController } from './ssr.controller';
import { SsrService } from './ssr.service';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Case])],
  controllers: [SsrController],
  providers: [SsrService],
})
export class SsrModule {}