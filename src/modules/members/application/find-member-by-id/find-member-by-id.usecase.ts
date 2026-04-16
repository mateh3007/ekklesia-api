import { Injectable, NotFoundException } from '@nestjs/common';
import { MemberRepository } from '../../domain/member.repository.js';
import { Member } from '../../domain/member.entity.js';

@Injectable()
export class FindMemberByIdUseCase {
  constructor(private readonly memberRepository: MemberRepository) {}

  async execute(id: string): Promise<Member> {
    const member = await this.memberRepository.findById(id);

    if (!member) {
      throw new NotFoundException(`Membro com ID "${id}" não encontrado.`);
    }

    return member;
  }
}
