import { ChurchPermission } from './church-permission.entity.js';

export abstract class ChurchPermissionRepository {
  abstract grant(churchId: string, permissionId: string): Promise<ChurchPermission>;
  abstract revoke(churchId: string, permissionId: string): Promise<void>;
  abstract findAllByChurchId(churchId: string): Promise<ChurchPermission[]>;
  abstract hasPermission(
    churchId: string,
    permissionName: string,
  ): Promise<boolean>;
  abstract findActivePermissionNames(churchId: string): Promise<string[]>;
  abstract grantByPermissionName(churchId: string, permissionName: string): Promise<void>;
}
