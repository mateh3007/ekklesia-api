import { Injectable, NotFoundException } from '@nestjs/common';
import { MemberFollowUpRepository } from '../../domain/member-follow-up.repository.js';

@Injectable()
export class DeleteFollowUpUseCase {
  constructor(private readonly followUpRepository: MemberFollowUpRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.followUpRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Acompanhamento com ID "${id}" não encontrado.`);
    }

    return this.followUpRepository.softDelete(id);
  }
}
