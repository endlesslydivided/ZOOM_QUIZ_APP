import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserArgs = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest().zoomContext;
});

