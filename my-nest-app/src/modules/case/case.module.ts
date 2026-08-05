import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaseService } from './case.service';
import { ClientCaseController } from './client/client-case.controller';
import { Case } from './entities/case.entity';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [TypeOrmModule.forFeature([Case]), CategoryModule],
  controllers: [ClientCaseController],
  providers: [CaseService],
  exports: [],
})
export class CaseModule {}