import { Injectable } from '@nestjs/common';
import { ChurchPermissionRepository } from '../../domain/church-permission.repository.js';

@Injectable()
export class GetActivePermissionsUseCase {
  constructor(private readonly churchPermissionRepository: ChurchPermissionRepository) {}

  async execute(churchId: string): Promise<string[]> {
    return this.churchPermissionRepository.findActivePermissionNames(churchId);
  }
}
