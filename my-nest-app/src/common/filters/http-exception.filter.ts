import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
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
    } else if (exception instanceof QueryFailedError) {
      // 数据库错误 — 翻译为友好消息，技术细节记录到日志
      status = HttpStatus.BAD_REQUEST;
      const dbError = this.handleDatabaseError(exception);
      code = dbError.code;
      message = dbError.message;
      this.logger.error(
        `Database error: ${exception.message}`,
        exception.stack,
        `${request.method} ${request.url}`,
      );
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

  /**
   * 将数据库错误（QueryFailedError）翻译为面向用户的友好错误消息。
   * 根据 MySQL 驱动错误号（errno）分类，避免暴露内部 SQL 细节。
   */
  private handleDatabaseError(error: QueryFailedError): {
    code: number;
    message: string;
  } {
    const driverError = error.driverError as any;
    const mysqlErrno: number | undefined = driverError?.errno;

    switch (mysqlErrno) {
      case 1406: // Data too long for column
        return {
          code: RESPONSE_CODE.DB_DATA_TOO_LONG,
          message: '字段值过长，请检查输入内容',
        };
      case 1062: // Duplicate entry
        return {
          code: RESPONSE_CODE.DB_DUPLICATE_ENTRY,
          message: '数据已存在，请检查唯一字段',
        };
      case 1452: // Cannot add or update a child row (foreign key)
        return {
          code: RESPONSE_CODE.DB_FOREIGN_KEY_FAIL,
          message: '关联数据不存在，请检查关联字段',
        };
      case 1451: // Cannot delete or update a parent row (foreign key)
        return {
          code: RESPONSE_CODE.DB_FOREIGN_KEY_BLOCK,
          message: '该记录存在关联数据，无法删除',
        };
      case 1048: // Column cannot be null
        return {
          code: RESPONSE_CODE.DB_NOT_NULL,
          message: '必填字段不能为空',
        };
      default:
        return {
          code: RESPONSE_CODE.DB_ERROR,
          message: '数据操作异常，请稍后重试或联系管理员',
        };
    }
  }
}
