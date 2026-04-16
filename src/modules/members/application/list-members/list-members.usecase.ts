import { Injectable } from '@nestjs/common';
import { MemberRepository } from '../../domain/member.repository.js';
import { Member, MemberStatus } from '../../domain/member.entity.js';

@Injectable()
export class ListMembersUseCase {
  constructor(private readonly memberRepository: MemberRepository) {}

  async execute(churchId: string, status?: MemberStatus): Promise<Member[]> {
    return this.memberRepository.findAllByChurchId(churchId, status);
  }
}
