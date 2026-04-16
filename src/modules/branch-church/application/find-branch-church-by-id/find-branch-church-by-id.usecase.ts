import { Injectable, NotFoundException } from '@nestjs/common';
import { BranchChurchRepository } from '../../domain/branch-church.repository.js';
import { BranchChurch } from '../../domain/branch-church.entity.js';

@Injectable()
export class FindBranchChurchByIdUseCase {
  constructor(
    private readonly branchChurchRepository: BranchChurchRepository,
  ) {}

  async execute(id: string): Promise<BranchChurch> {
    const branch = await this.branchChurchRepository.findById(id);

    if (!branch) {
      throw new NotFoundException(`Filial com id "${id}" não encontrada.`);
    }

    return branch;
  }
}
