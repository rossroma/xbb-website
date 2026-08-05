import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ArticleModule } from './modules/article/article.module';
import { CategoryModule } from './modules/category/category.module';
import { AdsModule } from './modules/ads/ads.module';
import { SettingsModule } from './modules/settings/settings.module';
import { MessageModule } from './modules/message/message.module';
import { SmsModule } from './modules/sms/sms.module';
import { LogsModule } from './modules/logs/logs.module';
import { UploadModule } from './modules/upload/upload.module';
import { CaseModule } from './modules/case/case.module';
import { PartnerModule } from './modules/partner/partner.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // 限流模块（供各提交接口通过 @Throttle() 装饰器按需使用）
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 5,
    }]),
    // 缓存模块（内存缓存，TTL 默认 5 分钟）
    CacheModule.register({
      isGlobal: true,
      ttl: 300_000, // 5 分钟
      max: 100,      // 最多缓存 100 个 key
    }),
    // 定时任务调度
    ScheduleModule.forRoot(),
    // 启用数据库连接
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        connectTimeout: 30000, // MySQL 握手超时，避免 DNS 反解导致超时
        synchronize: false, // 生产环境设为false
        logging: configService.get('NODE_ENV') === 'development',
        timezone: 'Z', // 统一使用 UTC 时区，避免 DATEIME 列时区偏移
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    ArticleModule,
    CategoryModule,
    AdsModule,
    SettingsModule,
    MessageModule,
    SmsModule,
    LogsModule,
    UploadModule,
    CaseModule,
    PartnerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule { }
