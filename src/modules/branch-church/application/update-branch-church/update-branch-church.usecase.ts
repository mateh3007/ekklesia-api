import { Injectable, NotFoundException } from '@nestjs/common';
import { BranchChurchRepository } from '../../domain/branch-church.repository.js';
import { BranchChurch } from '../../domain/branch-church.entity.js';
import { UpdateBranchChurchDto } from './update-branch-church.dto.js';

@Injectable()
export class UpdateBranchChurchUseCase {
  constructor(
    private readonly branchChurchRepository: BranchChurchRepository,
  ) {}

  async execute(id: string, dto: UpdateBranchChurchDto): Promise<BranchChurch> {
    const existing = await this.branchChurchRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Filial com id "${id}" não encontrada.`);
    }

    return this.branchChurchRepository.update(id, dto);
  }
}
