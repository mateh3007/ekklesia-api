import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/required-permissions.decorator.js';
import { PrismaService } from '../../infrastructure/prisma/prisma.service.js';
import { JwtPayload } from '../decorators/current-user.decorator.js';

/**
 * ABAC (Attribute-Based Access Control) guard.
 *
 * Flow:
 *  1. Read required permissions from @RequiredPermissions() decorator.
 *  2. If none declared, allow through (public-like route or already protected by JwtAuthGuard only).
 *  3. Get the authenticated user from request (set by JwtAuthGuard).
 *  4. Query church_permissions to verify the user's church holds ALL required permissions.
 *  5. Deny with 403 if any permission is missing or inactive.
 *
 * Usage:
 *  @UseGuards(JwtAuthGuard, PermissionsGuard)
 *  @RequiredPermissions('users:create')
 *  @Post()
 *  async create() {}
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: JwtPayload = request.user;

    if (!user) {
      throw new UnauthorizedException('Usuário não autenticado.');
    }

    const grantedPermissions = await this.prisma.churchPermission.findMany({
      where: {
        churchId: user.churchId,
        isActive: true,
        permission: {
          name: { in: requiredPermissions },
        },
      },
      select: {
        permission: { select: { name: true } },
      },
    });

    const grantedNames = grantedPermissions.map((cp) => cp.permission.name);
    const hasAll = requiredPermissions.every((p) => grantedNames.includes(p));

    if (!hasAll) {
      const missing = requiredPermissions.filter(
        (p) => !grantedNames.includes(p),
      );
      throw new ForbiddenException(
        `Permissões insuficientes: ${missing.join(', ')}`,
      );
    }

    return true;
  }
}
