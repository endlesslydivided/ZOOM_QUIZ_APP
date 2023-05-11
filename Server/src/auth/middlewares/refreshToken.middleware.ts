import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
  private refreshHeader = 'Refresh';

  async use(
    req: Request & { refreshToken?: string },
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const refreshToken = req.header(this.refreshHeader);

      req['refreshToken'] = null;

      if (refreshToken) {
        req['refreshToken'] = refreshToken;
      }
      next();
    } catch (e) {
      next();
    }
  }
}
