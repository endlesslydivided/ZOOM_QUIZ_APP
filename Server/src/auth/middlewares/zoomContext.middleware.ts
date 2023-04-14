import { forwardRef, HttpException, Inject, Injectable, InternalServerErrorException, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { contextHeader, getAppContext } from 'src/utils/cipher';

@Injectable()
export class ZoomContextMiddleware implements NestMiddleware {

    constructor() 
    {

    }

    async use(req: Request, res: Response, next: NextFunction) 
    {
        try 
        {
            const header = req.header(contextHeader);
            const zoomContext = header && getAppContext(header);
            
            req['zoomContext'] = null;
            
            if(zoomContext)
            {
                req['zoomContext'] = zoomContext;
            }    
            next();
        } 
        catch (e) 
        {
            next();
        }
    } 
}