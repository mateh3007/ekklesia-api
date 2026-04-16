import { Injectable, NotFoundException } from '@nestjs/common';
import { SmallGroupRepository } from '../../domain/small-group.repository.js';
import { SmallGroup } from '../../domain/small-group.entity.js';

@Injectable()
export class FindSmallGroupByIdUseCase {
  constructor(private readonly smallGroupRepository: SmallGroupRepository) {}

  async execute(id: string): Promise<SmallGroup> {
    const smallGroup = await this.smallGroupRepository.findById(id);

    if (!smallGroup) {
      throw new NotFoundException(`Célula com ID "${id}" não encontrada.`);
    }

    return smallGroup;
  }
}
