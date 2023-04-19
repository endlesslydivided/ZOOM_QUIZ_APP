import { BadRequestException, ExecutionContext, ForbiddenException, forwardRef, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';

import { Request } from 'express';

@Injectable()
export class ZoomMeetGuard
{
  async canActivate(context: ExecutionContext): Promise<boolean>  
  {
    try 
    {
      const request: Request = context.switchToHttp().getRequest();
      const zoomContext =request['zoomContext'];
      if(!zoomContext.mid)
      {
        throw new BadRequestException("You can only make it while meeting)");
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