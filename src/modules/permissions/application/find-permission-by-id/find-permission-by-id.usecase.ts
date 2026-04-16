import { Injectable, NotFoundException } from '@nestjs/common';
import { PermissionRepository } from '../../domain/permission.repository.js';
import { Permission } from '../../domain/permission.entity.js';

@Injectable()
export class FindPermissionByIdUseCase {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async execute(id: string): Promise<Permission> {
    const permission = await this.permissionRepository.findById(id);

    if (!permission) {
      throw new NotFoundException(
        `Permissão com id "${id}" não encontrada.`,
      );
    }

    return permission;
  }
}
