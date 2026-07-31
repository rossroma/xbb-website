import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaseService } from './case.service';
import { ClientCaseController } from './client/client-case.controller';
import { Case } from './entities/case.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Case])],
  controllers: [ClientCaseController],
  providers: [CaseService],
  exports: [CaseService],
})
export class CaseModule {}