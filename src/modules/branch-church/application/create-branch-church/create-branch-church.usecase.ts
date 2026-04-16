import { Injectable } from '@nestjs/common';
import { BranchChurchRepository } from '../../domain/branch-church.repository.js';
import { BranchChurch } from '../../domain/branch-church.entity.js';
import { CreateBranchChurchDto } from './create-branch-church.dto.js';

@Injectable()
export class CreateBranchChurchUseCase {
  constructor(
    private readonly branchChurchRepository: BranchChurchRepository,
  ) {}

  async execute(dto: CreateBranchChurchDto): Promise<BranchChurch> {
    const branch = new BranchChurch({
      churchId: dto.churchId,
      name: dto.name,
      address: dto.address,
      phone: dto.phone,
      isActive: true,
    });

    return this.branchChurchRepository.create(branch);
  }
}
