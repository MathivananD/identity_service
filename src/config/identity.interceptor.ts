import {
  ArgumentsHost,
  CallHandler,
  Catch,
  ExceptionFilter,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, map, Observable, throwError } from 'rxjs';



@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, CommonResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    return next.handle().pipe(
      map(
        (datas) => {
          const message=datas?.message||"Success"
          const statusCode=datas?.statusCode||200;
          const success=datas?.suceess||true;
          const data=datas?.data||datas;
          return datas;
        },
      ),
      catchError((err: HttpException) =>
        throwError(() => {
          
   
          console.log(err);
          
          return this.errorHandler(err, context);
        }),
      ),
    );
  }
  errorHandler(exception: HttpException, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
        const message=exception.message||"Success"
        const statusCode=status||500;
        const success=false;
        
    response.status(status).json({
      success:success,
      statusCode:statusCode,
      message
    });
    
  }
}



@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<any>();
    const request = ctx.getRequest<any>();
    console.log("-------------from catch filter");
    
    if (response.headersSent) {
      
      return;
    }
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    response.status(status).json(
      new CommonResponse(false, status, message, null, (exception as any)?.response),
    );
  }
}

export class CommonResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data?: T;
    errors?: any;
  
    constructor(success: boolean, statusCode: number, message: string, data?: T, errors?: any) {
      this.statusCode = statusCode;
      this.success = success;
      this.message = message;
      this.data = data;
      this.errors = errors;
    }
  }


// export class CommonResponse<T> {
//   success: boolean;
//   statusCode: number;
//   message: string;
//   data?: T;

//   constructor(success: boolean, statusCode: number, message: string, data?: T) {
//     this.success = success;
//     this.statusCode = statusCode;
//     this.message = message;
//     this.data = data;
//   }
// }
