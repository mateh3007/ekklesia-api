import { Permission } from './permission.entity.js';

export abstract class PermissionRepository {
  abstract create(permission: Permission): Promise<Permission>;
  abstract findById(id: string): Promise<Permission | null>;
  abstract findByName(name: string): Promise<Permission | null>;
  abstract findAll(): Promise<Permission[]>;
  abstract findByModule(module: string): Promise<Permission[]>;
}
