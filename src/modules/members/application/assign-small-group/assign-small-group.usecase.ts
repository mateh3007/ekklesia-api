import { Injectable, NotFoundException } from '@nestjs/common';
import { MemberRepository } from '../../domain/member.repository.js';
import { SmallGroupRepository } from '../../../small-groups/domain/small-group.repository.js';
import { Member } from '../../domain/member.entity.js';
import { AssignSmallGroupDto } from './assign-small-group.dto.js';

@Injectable()
export class AssignSmallGroupUseCase {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly smallGroupRepository: SmallGroupRepository,
  ) {}

  async execute(memberId: string, dto: AssignSmallGroupDto): Promise<Member> {
    const member = await this.memberRepository.findById(memberId);

    if (!member) {
      throw new NotFoundException(`Membro com ID "${memberId}" não encontrado.`);
    }

    if (dto.smallGroupId) {
      const smallGroup = await this.smallGroupRepository.findById(dto.smallGroupId);

      if (!smallGroup) {
        throw new NotFoundException(`Célula com ID "${dto.smallGroupId}" não encontrada.`);
      }
    }

    return this.memberRepository.assignSmallGroup(memberId, dto.smallGroupId);
  }
}
