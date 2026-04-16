import { Injectable, NotFoundException } from '@nestjs/common';
import { SmallGroupRepository } from '../../domain/small-group.repository.js';
import { SmallGroup } from '../../domain/small-group.entity.js';
import { UpdateSmallGroupDto } from './update-small-group.dto.js';

@Injectable()
export class UpdateSmallGroupUseCase {
  constructor(private readonly smallGroupRepository: SmallGroupRepository) {}

  async execute(id: string, dto: UpdateSmallGroupDto): Promise<SmallGroup> {
    const existing = await this.smallGroupRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Célula com ID "${id}" não encontrada.`);
    }

    return this.smallGroupRepository.update(id, dto);
  }
}
