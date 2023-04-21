import { Controller, Get, Inject, Req, Res, Session, UseGuards, forwardRef } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { contextHeader, getAppContext } from './utils/cipher.js';
import { Session as ExpressSession} from 'express-session';
import { ZoomContextGuard } from './auth/guards/zoomContext.guard';
import { ZoomContext } from './auth/decorators/zoomContext.decorator';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,) {}

  @Get()
  async homeRoute(@Req() req:Request,@Res() res:Response,): Promise<void> {
    try
    {
      const context = req.header(contextHeader);
      res.redirect(process.env.REACT_APP_URI + `?context=${context}`);
    } 
    catch (e) 
    {
      throw e;
    }
  }

  @Get('/context')
  async contextRoute(@ZoomContext() zoomContext:any): Promise<void> {
    try
    {
      return zoomContext;
    } 
    catch (e) 
    {
      throw e;
    }
  }

  @Get('/install')
  async installRoute(@Res() res:Response,@Session() session:ExpressSession & {state:any,verifier:any}): Promise<void>
  {
    const { url, state, verifier } = await this.appService.getInstallURL();
    session.state = state;
    session.verifier = verifier;
    res.redirect(url.href);
  }


}
