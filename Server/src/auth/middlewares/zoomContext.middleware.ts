import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { contextHeader, getAppContext } from '../../share/utils/cipher';
import { ZoomContext } from '../decorators/zoomContext.decorator';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ZoomContextMiddleware implements NestMiddleware {

  constructor(private configService: ConfigService){};

  async use(
    req: Request & { zoomContext?: ZoomContext },
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const header = req.header(contextHeader);
      const zoomContext = header && getAppContext(header,this.configService.get<string>('ZM_CLIENT_SECRET'));

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
