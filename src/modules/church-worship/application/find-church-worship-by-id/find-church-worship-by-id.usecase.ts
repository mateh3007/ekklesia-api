import { Injectable, NotFoundException } from '@nestjs/common';
import { ChurchWorshipRepository } from '../../domain/church-worship.repository.js';
import { ChurchWorship } from '../../domain/church-worship.entity.js';

@Injectable()
export class FindChurchWorshipByIdUseCase {
  constructor(private readonly churchWorshipRepository: ChurchWorshipRepository) {}

  async execute(id: string): Promise<ChurchWorship> {
    const worship = await this.churchWorshipRepository.findById(id);

    if (!worship) {
      throw new NotFoundException(`Culto com ID "${id}" não encontrado.`);
    }

    return worship;
  }
}
