import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ZoomAccessToken = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest().accessToken;
});

