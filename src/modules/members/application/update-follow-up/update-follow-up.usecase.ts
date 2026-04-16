import { Injectable, NotFoundException } from '@nestjs/common';
import { MemberFollowUpRepository } from '../../domain/member-follow-up.repository.js';
import { MemberFollowUp } from '../../domain/member-follow-up.entity.js';
import { UpdateFollowUpDto } from './update-follow-up.dto.js';

@Injectable()
export class UpdateFollowUpUseCase {
  constructor(private readonly followUpRepository: MemberFollowUpRepository) {}

  async execute(id: string, dto: UpdateFollowUpDto): Promise<MemberFollowUp> {
    const existing = await this.followUpRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Acompanhamento com ID "${id}" não encontrado.`);
    }

    return this.followUpRepository.update(id, {
      type: dto.type,
      description: dto.description,
    });
  }
}
