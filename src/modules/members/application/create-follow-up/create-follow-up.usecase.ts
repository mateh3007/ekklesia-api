import { Injectable, NotFoundException } from '@nestjs/common';
import { MemberFollowUpRepository } from '../../domain/member-follow-up.repository.js';
import { MemberRepository } from '../../domain/member.repository.js';
import { MemberFollowUp } from '../../domain/member-follow-up.entity.js';
import { CreateFollowUpDto } from './create-follow-up.dto.js';

@Injectable()
export class CreateFollowUpUseCase {
  constructor(
    private readonly followUpRepository: MemberFollowUpRepository,
    private readonly memberRepository: MemberRepository,
  ) {}

  async execute(
    churchId: string,
    memberId: string,
    createdBy: string,
    dto: CreateFollowUpDto,
  ): Promise<MemberFollowUp> {
    const member = await this.memberRepository.findById(memberId);

    if (!member) {
      throw new NotFoundException(`Membro com ID "${memberId}" não encontrado.`);
    }

    const followUp = new MemberFollowUp({
      churchId,
      memberId,
      type: dto.type,
      description: dto.description,
      createdBy,
    });

    return this.followUpRepository.create(followUp);
  }
}
