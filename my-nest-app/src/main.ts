import 'dotenv/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from './modules/auth/guards/permissions.guard';
import { EnvConfig } from './common/config/env.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 通过 DI 容器获取统一环境变量配置（替代散落的 process.env 调用）
  const env = app.get(EnvConfig);

  // 全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // 全局拦截器
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseInterceptor(),
  );

  // 全局验证管道
  app.useGlobalPipes(new ValidationPipe());

  // 全局守卫：JWT 认证 → 权限校验（按顺序执行）
  const reflector = app.get(Reflector);
  app.useGlobalGuards(
    new JwtAuthGuard(reflector),
    new PermissionsGuard(reflector),
  );

  // 启用 CORS（仅允许白名单来源，未配置时拒绝所有跨域请求）
  app.enableCors({
    origin: env.corsOrigins.length > 0 ? env.corsOrigins : false,
    credentials: true,
  });

  // 测试数据库连接
  console.log('🚀 NestJS application starting...');
  console.log('📊 Database connection configured');
  console.log('🛡️  Global filters, interceptors, and pipes registered');
  console.log('🔐 JWT authentication configured');

  const port = env.port;
  await app.listen(port);
  console.log(`🌟 Application is running on: http://localhost:${port}`);
}
bootstrap();