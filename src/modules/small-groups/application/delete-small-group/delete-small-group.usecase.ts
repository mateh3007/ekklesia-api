import { Injectable, NotFoundException } from '@nestjs/common';
import { SmallGroupRepository } from '../../domain/small-group.repository.js';

@Injectable()
export class DeleteSmallGroupUseCase {
  constructor(private readonly smallGroupRepository: SmallGroupRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.smallGroupRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Célula com ID "${id}" não encontrada.`);
    }

    return this.smallGroupRepository.softDelete(id);
  }
}
