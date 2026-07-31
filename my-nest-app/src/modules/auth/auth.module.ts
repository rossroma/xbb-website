import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AdminService } from './admin.service';
import { AdminAuthController } from './admin/admin-auth.controller';
import { AdminAdminController } from './admin/admin-admin.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Admin } from './entities/admin.entity';
import { AdminGroup } from './entities/admin-group.entity';
import { AdminAction } from './entities/admin-action.entity';
import { LogsModule } from '../logs/logs.module';
import { OperationLogInterceptor } from '../logs/interceptors/operation-log.interceptor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, AdminGroup, AdminAction]),
    LogsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'your-secret-key'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN', '2h'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AdminAuthController, AdminAdminController],
  providers: [AuthService, AdminService, JwtStrategy, JwtAuthGuard, OperationLogInterceptor],
  exports: [AuthService, AdminService, JwtAuthGuard],
})
export class AuthModule { }
