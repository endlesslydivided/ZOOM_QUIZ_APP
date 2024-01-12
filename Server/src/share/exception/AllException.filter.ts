import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request, Response } from 'express';

import { ValidationException } from './types/validation.exception';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown & { message?: string }, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const request: Request = ctx.getRequest<Request>();
    const response: Response = ctx.getResponse<Response>();
    const status: number =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception?.message;
    if (exception instanceof ValidationException) {
      let entityErrors = '';
      for (const key in exception.entityErrors) {
        entityErrors += exception.entityErrors[key].join('\n');
      }
      response.status(status).json({
        message: entityErrors,
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    } else {
      response.status(status).json({
        message,
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
