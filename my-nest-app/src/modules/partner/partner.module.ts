import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PartnerService } from './partner.service';
import { PartnerController } from './partner.controller';

/**
 * 合作伙伴查询模块
 *
 * 功能：代理前端查询请求至三方钉钉云 API，清洗数据后返回
 * 依赖：HttpModule（调用三方 API）
 * 无数据库依赖（纯代理转发，不落库）
 */
@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 3,
    }),
  ],
  controllers: [PartnerController],
  providers: [PartnerService],
})
export class PartnerModule {}