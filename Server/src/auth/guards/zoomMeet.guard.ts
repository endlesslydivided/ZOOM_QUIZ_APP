import {
  BadRequestException,
  ExecutionContext,
  ForbiddenException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';

import { ZoomContext } from '../decorators/zoomContext.decorator';

@Injectable()
export class ZoomMeetGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: Request & { zoomContext?: ZoomContext } = context
        .switchToHttp()
        .getRequest();
      const zoomContext: ZoomContext = request['zoomContext'];
      if (!zoomContext.mid) {
        throw new BadRequestException('You can only make it while meeting)');
      }
      return true;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new InternalServerErrorException('Internal server error.');
    }
  }
}
