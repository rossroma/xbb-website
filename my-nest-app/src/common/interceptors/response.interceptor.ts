import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseResult } from '../interfaces/response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseResult<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseResult<T>> {
    return next.handle().pipe(
      map((data) => {
        // 如果返回的数据已经是 ResponseResult 格式，直接返回
        if (data instanceof ResponseResult) {
          return data;
        }

        // 否则包装成统一格式
        return ResponseResult.success(data);
      }),
    );
  }
}