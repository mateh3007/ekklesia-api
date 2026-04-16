import { Injectable } from '@nestjs/common';
import { ChurchPermissionRepository } from '../../domain/church-permission.repository.js';
import { ChurchPermission } from '../../domain/church-permission.entity.js';

@Injectable()
export class ListChurchPermissionsUseCase {
  constructor(
    private readonly churchPermissionRepository: ChurchPermissionRepository,
  ) {}

  async execute(churchId: string): Promise<ChurchPermission[]> {
    return this.churchPermissionRepository.findAllByChurchId(churchId);
  }
}
