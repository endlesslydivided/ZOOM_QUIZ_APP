import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import debug from 'debug';
import * as session from 'express-session';
import helmet from 'helmet';
import { URL } from 'url';

import { AppModule } from './app.module';
import { AllExceptionFilter } from './share/exception/AllException.filter';
import { ValidationExceptionFactory } from './share/validation/validation.exceptionFactory';

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  const viewDir = `${__dirname}/server/views`;

  app.enableCors({
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.set('view engine', 'pug');
  app.set('views', viewDir);

  const appName = process.env.APP_NAME;

  const redirectHost: string = new URL(process.env.ZM_REDIRECT_URL).host;
  const logFunc = (
    r: InternalAxiosRequestConfig & AxiosResponse,
  ): InternalAxiosRequestConfig & AxiosResponse => {
    if (process.env.NODE_ENV !== 'production') {
      const { method, status, url, baseURL, config } = r;

      const endp = url || config?.url;
      let str = endp;

      if (method) str = `${method.toUpperCase()} ${str}`;
      if (status) str = `${status} ${str}`;

      debug(`${appName}:axios`)(str);
    }

    return r;
  };

  axios.interceptors.request.use(logFunc);
  axios.interceptors.response.use(logFunc);

  app.use(
    helmet({
      frameguard: {
        action: 'sameorigin',
      },
      hsts: {
        maxAge: 31536000,
      },
      referrerPolicy: { policy: 'same-origin' },
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
    }),
  );

  app.useBodyParser('json', { limit: '10mb' });
  app.use(compression());
  app.use(cookieParser());

  app.use(
    session({
      secret: [process.env.SESSION_SECRET],
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      },
    }),
  );

  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: ValidationExceptionFactory,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Zoom Quiz API')
    .setDescription(
      `
      Documentation for the Zoom Quiz application API.`,
    )
    .setVersion(`1.0.0`)
    .setContact(
      'Alexander Kovalyov',
      'https://github.com/endlesslydivided',
      'sashakovalev2002@hotmail.com',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3001);
};
bootstrap();
