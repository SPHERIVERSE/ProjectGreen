import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => { // ⬅️ data is now typed as string
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user; // ⬅️ Returns the specific key or the whole user object
  },
);
