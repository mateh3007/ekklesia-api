import { Injectable, NotFoundException } from '@nestjs/common';
import { ChurchWorshipRepository } from '../../domain/church-worship.repository.js';
import { ChurchWorship } from '../../domain/church-worship.entity.js';
import { UpdateChurchWorshipDto } from './update-church-worship.dto.js';

@Injectable()
export class UpdateChurchWorshipUseCase {
  constructor(private readonly churchWorshipRepository: ChurchWorshipRepository) {}

  async execute(id: string, dto: UpdateChurchWorshipDto): Promise<ChurchWorship> {
    const existing = await this.churchWorshipRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Culto com ID "${id}" não encontrado.`);
    }

    return this.churchWorshipRepository.update(id, dto);
  }
}
