import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

// 加载 .env 文件
config();

// 用于 TypeORM CLI 的 DataSource 配置
const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'db_xbb_www',
  charset: 'utf8mb4', // 支持 emoji 等 4 字节 UTF-8 字符
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  connectTimeout: 30000,
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});

export default dataSource;