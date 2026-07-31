export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

export class ResponseResult<T = any> implements ApiResponse<T> {
  code: number;
  message: string;
  data?: T;

  constructor(code: number, message: string, data?: T) {
    this.code = code;
    this.message = message;
    this.data = data;
  }

  static success<T>(data?: T, message = '操作成功'): ResponseResult<T> {
    return new ResponseResult(200, message, data);
  }

  static error(code = 500, message = '操作失败'): ResponseResult {
    return new ResponseResult(code, message);
  }
}