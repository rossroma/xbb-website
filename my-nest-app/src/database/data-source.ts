import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const createDataSource = (configService: ConfigService): DataSource => {
  return new DataSource({
    type: 'mysql',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_DATABASE'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    connectTimeout: 30000, // MySQL 握手超时，避免 DNS 反解导致超时
    synchronize: false, // 生产环境设为 false
    logging: configService.get('NODE_ENV') === 'development',
  });
};