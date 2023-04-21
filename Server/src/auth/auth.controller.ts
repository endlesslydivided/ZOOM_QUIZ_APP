import { Controller, Get, Query, Req, Res, Session, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import {Session  as ExpressSession} from 'express-session';
import { RedirectQuery } from './queryUtils/RedirectQuery';
import { AuthService } from './auth.service';
import { ZoomRefreshToken } from './decorators/refreshToken.decorator.';
import { ZoomContext } from './decorators/zoomContext.decorator';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { ZoomAccessToken } from './decorators/accessToken.decorator';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}


    @Get()
    async redirect(@Query() {code}:any ,@Res() res:Response, 
    @Session() session:ExpressSession & {state:any,verifier:any})
    {
        session.state = null;
        try 
        {
            
            const verifier = session.verifier;
            session.verifier = null;
    
            const { access_token: accessToken } = await this.authService.getToken(code, verifier,'S256');
    
            const deeplink = await this.authService.getDeeplink(accessToken);
    
            res.redirect(deeplink);
        } 
        catch (e) 
        {
            throw e;
        }
    }

    @Get('/token')
    async redirectClient(@Query() {code,verifier}:any )
    {
        const tokens = await this.authService.getToken(code, verifier,'S256');
        return tokens;
    }

    @Get('/refresh-token')
    async refreshToken(@ZoomRefreshToken() token:string )
    {
        const tokens = await this.authService.refreshToken(token);
        return tokens;
    }

    @UseGuards(AccessTokenGuard)
    @Get('/me')
    async getMe(@ZoomContext() zoomContext:any,@ZoomAccessToken() token: string)
    {
        const user = await this.authService.getMe(token);
        return user;
    }
}
