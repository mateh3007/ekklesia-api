import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'required_permissions';

/**
 * Decorator to declare which permissions a route requires.
 * Used together with PermissionsGuard (ABAC).
 *
 * @example
 * @RequiredPermissions('users:create', 'users:update')
 */
export const RequiredPermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
