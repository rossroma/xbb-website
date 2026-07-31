import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  private readonly errorCode: number;

  constructor(
    errorCode: number,
    message: string,
    httpStatus: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(message, httpStatus);
    this.errorCode = errorCode;
  }

  getErrorCode(): number {
    return this.errorCode;
  }
}