import { ExecutionContext, ForbiddenException, forwardRef, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';

import { Request } from 'express';

@Injectable()
export class ZoomContextGuard
{
  async canActivate(context: ExecutionContext): Promise<boolean>  
  {
    try 
    {
      const request: Request = context.switchToHttp().getRequest();
      const zoomContext =request['zoomContext'];
      if(!zoomContext)
      {
        throw new ForbiddenException("User access forbidden. App isn't opened in ZOOM");
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