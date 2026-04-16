import { Injectable } from '@nestjs/common';
import { PermissionRepository } from '../../domain/permission.repository.js';
import { Permission } from '../../domain/permission.entity.js';

@Injectable()
export class ListPermissionsUseCase {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async execute(): Promise<Permission[]> {
    return this.permissionRepository.findAll();
  }
}
