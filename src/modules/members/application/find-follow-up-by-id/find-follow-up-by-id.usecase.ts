import { Injectable, NotFoundException } from '@nestjs/common';
import { MemberFollowUpRepository } from '../../domain/member-follow-up.repository.js';
import { MemberFollowUp } from '../../domain/member-follow-up.entity.js';

@Injectable()
export class FindFollowUpByIdUseCase {
  constructor(private readonly followUpRepository: MemberFollowUpRepository) {}

  async execute(id: string): Promise<MemberFollowUp> {
    const followUp = await this.followUpRepository.findById(id);

    if (!followUp) {
      throw new NotFoundException(`Acompanhamento com ID "${id}" não encontrado.`);
    }

    return followUp;
  }
}
