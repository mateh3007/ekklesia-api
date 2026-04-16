import { Injectable, ConflictException } from '@nestjs/common';
import { PermissionRepository } from '../../domain/permission.repository.js';
import { Permission } from '../../domain/permission.entity.js';
import { CreatePermissionDto } from './create-permission.dto.js';

@Injectable()
export class CreatePermissionUseCase {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async execute(dto: CreatePermissionDto): Promise<Permission> {
    const existing = await this.permissionRepository.findByName(dto.name);

    if (existing) {
      throw new ConflictException(
        `Já existe uma permissão com o nome "${dto.name}".`,
      );
    }

    const permission = new Permission({
      name: dto.name,
      description: dto.description,
      module: dto.module,
      action: dto.action,
      isActive: true,
    });

    return this.permissionRepository.create(permission);
  }
}
