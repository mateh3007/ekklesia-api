import { Injectable, NotFoundException } from '@nestjs/common';
import { ChurchRepository } from '../../domain/church.repository.js';
import { Church } from '../../domain/church.entity.js';
import { UpdateChurchDto } from './update-church.dto.js';

@Injectable()
export class UpdateChurchUseCase {
  constructor(private readonly churchRepository: ChurchRepository) {}

  async execute(id: string, dto: UpdateChurchDto): Promise<Church> {
    const existing = await this.churchRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Igreja com id "${id}" não encontrada.`);
    }

    return this.churchRepository.update(id, dto);
  }
}
