import { forwardRef, HttpException, Inject, Injectable, InternalServerErrorException, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { contextHeader, getAppContext } from 'src/utils/cipher';

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {

    private refreshHeader = 'Refresh';

    constructor() 
    {

    }

    async use(req: Request, res: Response, next: NextFunction) 
    {
        try 
        {
            const refreshToken = req.header(this.refreshHeader);
            
            req['refreshToken'] = null;
            
            if(refreshToken)
            {
                req['refreshToken'] = refreshToken;
            }    
            next();
        } 
        catch (e) 
        {
            next();
        }
    } 
}