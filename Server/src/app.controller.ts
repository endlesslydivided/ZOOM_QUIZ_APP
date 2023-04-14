import { Controller, Get, Req, Res, Session, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { contextHeader, getAppContext } from './utils/cipher.js';
import { Session as ExpressSession} from 'express-session';
import { ZoomContextGuard } from './auth/guards/zoomContext.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(ZoomContextGuard)
  @Get()
  async homeRoute(@Req() req:Request,@Res() res:Response): Promise<void> {
    try
    {
      res.end();
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
