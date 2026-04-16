import { Injectable, NotFoundException } from '@nestjs/common';
import { MemberRepository } from '../../domain/member.repository.js';

@Injectable()
export class DeleteMemberUseCase {
  constructor(private readonly memberRepository: MemberRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.memberRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Membro com ID "${id}" não encontrado.`);
    }

    return this.memberRepository.softDelete(id);
  }
}
