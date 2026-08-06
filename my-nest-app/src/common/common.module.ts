import { Global, Module } from '@nestjs/common';
import { EnvConfig } from './config/env.config';

/**
 * 全局公共模块
 *
 * 提供 EnvConfig 等全局可用的服务，子模块无需重复 import 即可注入。
 */
@Global()
@Module({
  providers: [EnvConfig],
  exports: [EnvConfig],
})
export class CommonModule {}