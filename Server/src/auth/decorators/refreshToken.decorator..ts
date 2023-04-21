import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ZoomRefreshToken = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest().refreshTokens;
});

