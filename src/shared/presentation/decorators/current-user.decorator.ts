import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface JwtPayload {
  sub: string;
  churchId: string;
  role: string;
  email: string;
}

/**
 * Extracts the authenticated user from the request object.
 * Requires JwtAuthGuard to be applied first.
 *
 * @example
 * async create(@CurrentUser() user: JwtPayload) {}
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
