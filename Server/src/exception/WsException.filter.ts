//@ts-nocheck
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { ValidationException } from './types/validation.exception';

@Catch()
export class WsExceptionFilter implements ExceptionFilter  
{
  catch(exception: any, host: ArgumentsHost)
  {
    const ctx = host.switchToWs();
    const request:Request = ctx.getRequest<Request>();
    const response:Response = ctx.getResponse<Response>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;    
    const message  = exception?.message;
 
    response.status(status)
    .json({
      message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
    
   
  }
}