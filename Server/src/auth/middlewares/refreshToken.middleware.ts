import {
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { contextHeader, getAppContext } from 'src/utils/cipher';

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
