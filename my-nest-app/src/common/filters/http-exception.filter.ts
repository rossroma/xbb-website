import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BusinessException } from '../exceptions/business.exception';
import { ResponseResult } from '../interfaces/response.interface';
import { RESPONSE_CODE } from '../constants/response-code';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code: number = RESPONSE_CODE.INTERNAL_SERVER_ERROR;
    let message: string = '服务器内部错误';

    // 处理不同类型的异常
    if (exception instanceof BusinessException) {
      // 业务异常
      status = exception.getStatus();
      code = exception.getErrorCode();
      message = exception.message;
    } else if (exception instanceof HttpException) {
      // HTTP 异常
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || exception.message;

        // 处理验证错误
        if (Array.isArray(responseObj.message)) {
          message = responseObj.message.join(', ');
          code = RESPONSE_CODE.VALIDATION_ERROR;
        }
      } else {
        message = exception.message;
      }

      // 根据 HTTP 状态码设置业务错误码
      switch (status) {
        case HttpStatus.BAD_REQUEST:
          code = RESPONSE_CODE.BAD_REQUEST;
          break;
        case HttpStatus.UNAUTHORIZED:
          code = RESPONSE_CODE.UNAUTHORIZED;
          break;
        case HttpStatus.FORBIDDEN:
          code = RESPONSE_CODE.FORBIDDEN;
          break;
        case HttpStatus.NOT_FOUND:
          code = RESPONSE_CODE.NOT_FOUND;
          break;
        default:
          code = status;
      }
    } else {
      // 未知异常
      this.logger.error(
        `Unexpected error: ${exception}`,
        exception instanceof Error ? exception.stack : undefined,
        `${request.method} ${request.url}`,
      );
    }

    // 记录错误日志
    this.logger.error(
      `HTTP ${status} Error: ${message}`,
      `${request.method} ${request.url}`,
    );

    // 返回统一格式的错误响应
    const errorResponse = ResponseResult.error(code, message);

    response.status(status).json(errorResponse);
  }
}