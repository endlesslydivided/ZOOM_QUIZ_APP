import { forwardRef, HttpException, Inject, Injectable, InternalServerErrorException, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { contextHeader, getAppContext } from 'src/utils/cipher';

@Injectable()
export class AccessTokenMiddleware implements NestMiddleware {

    private authHeader = 'Authorization';

    constructor() 
    {

    }

    async use(req: Request, res: Response, next: NextFunction) 
    {
        try 
        {
            const accessTokenHeader = req.header(this.authHeader);
            
            req['accessToken'] = null;
            
            if(accessTokenHeader)
            {
                const accessTokenBearer = accessTokenHeader.split(' ');
                if(accessTokenBearer[0] === 'Bearer')
                {
                    req['accessToken'] = accessTokenBearer[1];

                }
            }    
            next();
        } 
        catch (e) 
        {
            next();
        }
    } 
}