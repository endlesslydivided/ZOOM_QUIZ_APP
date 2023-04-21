import { BadRequestException, ExecutionContext, ForbiddenException, forwardRef, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';

import { Request } from 'express';

@Injectable()
export class AccessTokenGuard
{
  async canActivate(context: ExecutionContext): Promise<boolean>  
  {
    try 
    {
      const request: Request = context.switchToHttp().getRequest();
      const accessToken =request['accessToken'];
      if(!accessToken)
      {
        throw new ForbiddenException("User access forbidden. Access token is required");
      }
      return true
     
    } 
    catch (e) 
    {
        if (e instanceof HttpException) 
        {
            throw e;
        } 
        throw new InternalServerErrorException("Internal server error.");
    }
  }
}