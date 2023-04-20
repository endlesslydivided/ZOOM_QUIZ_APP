import { Controller, Get, Query, Req, Res, Session } from '@nestjs/common';
import { Request, Response } from 'express';
import {Session  as ExpressSession} from 'express-session';
import { RedirectQuery } from './queryUtils/RedirectQuery';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}


    @Get()
    async redirect(
        @Query() {code,state}:any ,
        @Res() res:Response, 
        @Session() session:ExpressSession & {state:any,verifier:any})
    {
        session.state = null;

        try 
        {
            
            const verifier = session.verifier;
            session.verifier = null;
    
            // get Access Token from Zoom
            const { access_token: accessToken } = await this.authService.getToken(code, verifier,'S256');
    
            // fetch deeplink from Zoom API
            const deeplink = await this.authService.getDeeplink(accessToken);
    
            // redirect the user to the Zoom Client
            res.redirect(deeplink);
        } 
        catch (e) 
        {
            throw e;
        }
    }

    @Get('/token')
    async redirectClient(
        @Query() {code,state,verifier,redirect_uri}:any )

    {
        try 
        {
            const tokens = await this.authService.getToken(code, verifier,'S256');
    
    
            return tokens;
        } 
        catch (e) 
        {
            throw e;
        }
    }
}
