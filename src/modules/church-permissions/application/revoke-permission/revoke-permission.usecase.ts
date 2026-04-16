import { Injectable, NotFoundException } from '@nestjs/common';
import { ChurchPermissionRepository } from '../../domain/church-permission.repository.js';

@Injectable()
export class RevokePermissionUseCase {
  constructor(
    private readonly churchPermissionRepository: ChurchPermissionRepository,
  ) {}

  async execute(churchId: string, permissionId: string): Promise<void> {
    const existing = await this.churchPermissionRepository.hasPermission(
      churchId,
      permissionId,
    );

    if (!existing) {
      throw new NotFoundException(
        'Permissão não encontrada para esta igreja.',
      );
    }

    await this.churchPermissionRepository.revoke(churchId, permissionId);
  }
}
