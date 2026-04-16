import { Injectable, NotFoundException } from '@nestjs/common';
import { ChurchWorshipRepository } from '../../domain/church-worship.repository.js';

@Injectable()
export class DeleteChurchWorshipUseCase {
  constructor(private readonly churchWorshipRepository: ChurchWorshipRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.churchWorshipRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Culto com ID "${id}" não encontrado.`);
    }

    return this.churchWorshipRepository.softDelete(id);
  }
}
