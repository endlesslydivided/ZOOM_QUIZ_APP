import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import axios from 'axios';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import debug from 'debug';
import express from 'express';
import * as session from 'express-session';
import helmet from 'helmet';
import { dirname } from 'path';
import { fileURLToPath, URL } from 'url';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './exception/AllException.filter';
import { ValidationExceptionFactory } from './validation/validation.exceptionFactory';
import { NestExpressApplication } from '@nestjs/platform-express';
import {AbortController} from "node-abort-controller";




async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule,{rawBody:true});

  const viewDir = `${__dirname}/server/views`;

  app.set('view engine', 'pug');
  app.set('views', viewDir);

  const appName =process.env.APP_NAME;
 

  const redirectHost = new URL(process.env.ZM_REDIRECT_URL).host;
  const logFunc = (r) => {
      if (process.env.NODE_ENV !== 'production') {
          let { method, status, url, baseURL, config } = r;

          const endp = url || config?.url;
          const base = baseURL || config?.baseURL;
          let str = new URL(endp, base).href;

          if (method) str = `${method.toUpperCase()} ${str}`;
          if (status) str = `${status} ${str}`;

          debug(`${appName}:axios`)(str);
      }

      return r;
  };

  axios.interceptors.request.use(logFunc);
  axios.interceptors.response.use(logFunc);
  

  app.use(helmet({
    frameguard: {
      action: 'sameorigin',
    },
    hsts: {
        maxAge: 31536000,
    },
    referrerPolicy: {policy:"same-origin"},
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
          'default-src': 'self',
          styleSrc: ["'self'"],
          scriptSrc: ["'self'", 'https://appssdk.zoom.us/sdk.min.js'],
          imgSrc: ["'self'", `https://${redirectHost}`],
          'connect-src': 'self',
          'base-uri': 'self',
          'form-action': 'self',
      },
  },
  }));

  app.useBodyParser('json', { limit: '10mb' });
  app.use(compression());
  app.use(cookieParser());

  app.use(
    session({
      secret: [process.env.SESSION_SECRET],
      resave: false,
      saveUninitialized: false,
      cookie:
      {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly:true,
        secure:  process.env.NODE_ENV === 'production'
      }
    }),
  );

  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalPipes(new ValidationPipe(
    { 
      transform: true,
      exceptionFactory: ValidationExceptionFactory
    }));
  app.enableCors({
     origin:  true,
     credentials: true,
     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
     preflightContinue: false,
     optionsSuccessStatus: 204
   });
  
  await app.listen( process.env.PORT || 3001);
}
bootstrap();
