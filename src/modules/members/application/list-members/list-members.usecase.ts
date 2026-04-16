import { Injectable } from '@nestjs/common';
import { MemberRepository, MemberFilters } from '../../domain/member.repository.js';
import { Member } from '../../domain/member.entity.js';

@Injectable()
export class ListMembersUseCase {
  constructor(private readonly memberRepository: MemberRepository) {}

  async execute(churchId: string, filters?: MemberFilters): Promise<Member[]> {
    return this.memberRepository.findAllByChurchId(churchId, filters);
  }
}
