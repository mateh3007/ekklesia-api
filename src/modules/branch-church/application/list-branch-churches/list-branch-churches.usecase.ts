import { Injectable } from '@nestjs/common';
import { BranchChurchRepository } from '../../domain/branch-church.repository.js';
import { BranchChurch } from '../../domain/branch-church.entity.js';

@Injectable()
export class ListBranchChurchesUseCase {
  constructor(
    private readonly branchChurchRepository: BranchChurchRepository,
  ) {}

  async execute(churchId: string): Promise<BranchChurch[]> {
    return this.branchChurchRepository.findAllByChurchId(churchId);
  }
}
