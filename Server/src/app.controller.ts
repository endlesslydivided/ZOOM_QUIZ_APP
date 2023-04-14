import { Controller, Get, Req, Res, Session } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { contextHeader, getAppContext } from './utils/cipher.js';
import { Session as ExpressSession} from 'express-session';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async homeRoute(@Req() req:Request,@Res() res:Response): Promise<void> {
    try
      {
      const header = req.header(contextHeader);

      const isZoom = header && getAppContext(header);
      const name = isZoom ? 'Zoom' : 'Browser';

      return res.render('index', {isZoom,title: `Hello ${name}`});
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
