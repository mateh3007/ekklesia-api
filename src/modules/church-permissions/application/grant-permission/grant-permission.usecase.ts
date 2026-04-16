import { Injectable, ConflictException } from '@nestjs/common';
import { ChurchPermissionRepository } from '../../domain/church-permission.repository.js';
import { ChurchPermission } from '../../domain/church-permission.entity.js';
import { GrantPermissionDto } from './grant-permission.dto.js';

@Injectable()
export class GrantPermissionUseCase {
  constructor(
    private readonly churchPermissionRepository: ChurchPermissionRepository,
  ) {}

  async execute(
    churchId: string,
    dto: GrantPermissionDto,
  ): Promise<ChurchPermission> {
    const existing = await this.churchPermissionRepository.hasPermission(
      churchId,
      dto.permissionId,
    );

    if (existing) {
      throw new ConflictException(
        'Esta permissão já está concedida para esta igreja.',
      );
    }

    return this.churchPermissionRepository.grant(churchId, dto.permissionId);
  }
}
