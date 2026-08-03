import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';
import { LogsService } from '../logs.service';
import {
  OPERATION_LOG_KEY,
  OperationLogOptions,
} from '../decorators/operation-log.decorator';

@Injectable()
export class OperationLogInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly logsService: LogsService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const options = this.reflector.get<OperationLogOptions>(
      OPERATION_LOG_KEY,
      context.getHandler(),
    );

    if (!options) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const method = request.method;
    const url = request.url;
    const ip = request.ip || request.headers['x-forwarded-for'] || '';

    const typeMap: Record<number, string> = {
      1: '新增',
      2: '修改',
      3: '删除',
    };

    const actionText = typeMap[options.type] || '操作';
    const content = `${actionText}${options.title}`;

    return next.handle().pipe(
      tap(() => {
        this.logsService.logOperation({
          admin_id: user?.id,
          admin_name: user?.username,
          module: options.title,
          type: options.type,
          title: options.title,
          content,
          ip,
          method,
          url,
          params: request.body,
        });
      }),
    );
  }
}