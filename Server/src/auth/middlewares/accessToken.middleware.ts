import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AccessTokenMiddleware implements NestMiddleware {
  private authHeader = 'Authorization';

  async use(
    req: Request & { accessToken?: string },
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const accessTokenHeader: string = req.header(this.authHeader);

      req['accessToken'] = null;

      if (accessTokenHeader) {
        const accessTokenBearer = accessTokenHeader.split(' ');
        if (accessTokenBearer[0] === 'Bearer') {
          req['accessToken'] = accessTokenBearer[1];
        }
      }
      next();
    } catch (e) {
      next();
    }
  }
}
