import { Injectable } from '@nestjs/common';
import { MemberFollowUpRepository } from '../../domain/member-follow-up.repository.js';
import { MemberFollowUp } from '../../domain/member-follow-up.entity.js';

@Injectable()
export class ListFollowUpsUseCase {
  constructor(private readonly followUpRepository: MemberFollowUpRepository) {}

  async execute(memberId: string): Promise<MemberFollowUp[]> {
    return this.followUpRepository.findAllByMemberId(memberId);
  }
}
