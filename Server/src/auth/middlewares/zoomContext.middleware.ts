import {
  Injectable,
  NestMiddleware
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { contextHeader, getAppContext } from '../../utils/cipher';
import { ZoomContext } from '../decorators/zoomContext.decorator';

@Injectable()
export class ZoomContextMiddleware implements NestMiddleware {
  async use(
    req: Request & { zoomContext?: ZoomContext },
    res: Response, 
    next: NextFunction
  ): Promise<void> {
    try {
      const header = req.header(contextHeader);
      const zoomContext = header && getAppContext(header);

      req['zoomContext'] = null;

      if (zoomContext) {
        req['zoomContext'] = zoomContext;
      }
      next();
    } catch (e) {
      next();
    }
  }
}
