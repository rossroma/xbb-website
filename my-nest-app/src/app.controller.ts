import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseResult } from './common/interfaces/response.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  getTest() {
    return {
      message: 'API 测试成功',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }

  @Get('test-error')
  getTestError() {
    throw new Error('这是一个测试错误');
  }

  @Get('test-response')
  getTestResponse() {
    return ResponseResult.success(
      { id: 1, name: '测试数据' },
      '获取数据成功',
    );
  }
}
