import { Injectable, NotFoundException } from '@nestjs/common';
import { ChurchRepository } from '../../domain/church.repository.js';

@Injectable()
export class DeleteChurchUseCase {
  constructor(private readonly churchRepository: ChurchRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.churchRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Igreja com id "${id}" não encontrada.`);
    }

    await this.churchRepository.softDelete(id);
  }
}
