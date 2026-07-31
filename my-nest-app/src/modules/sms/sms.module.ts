import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { SmsService } from './sms.service';
import { SmsController } from './sms.controller';
import { SmsCode } from './entities/sms-code.entity';
import { SmsLog } from './entities/sms-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SmsCode, SmsLog]),
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 3,
    }),
    JwtModule.register({}),
  ],
  controllers: [SmsController],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}