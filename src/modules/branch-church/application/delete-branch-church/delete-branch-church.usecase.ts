import { Injectable, NotFoundException } from '@nestjs/common';
import { BranchChurchRepository } from '../../domain/branch-church.repository.js';

@Injectable()
export class DeleteBranchChurchUseCase {
  constructor(
    private readonly branchChurchRepository: BranchChurchRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.branchChurchRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Filial com id "${id}" não encontrada.`);
    }

    await this.branchChurchRepository.softDelete(id);
  }
}
