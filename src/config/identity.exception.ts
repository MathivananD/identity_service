import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<any>();
    const request = ctx.getRequest<any>();

    if (response.headersSent) {
      return;
    }
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    var messages: any;
    if (exception instanceof BadRequestException) {
      messages = exception.getResponse() ?? null;
    }
    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    response
      .status(status)
      .json(exception);
  }
}
export interface CommonResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errorCode?: number;
  statusCode?: number;
}