import { Injectable, NotFoundException } from '@nestjs/common';
import { MemberRepository } from '../../domain/member.repository.js';
import { Member } from '../../domain/member.entity.js';
import { UpdateMemberDto } from './update-member.dto.js';

@Injectable()
export class UpdateMemberUseCase {
  constructor(private readonly memberRepository: MemberRepository) {}

  async execute(id: string, dto: UpdateMemberDto): Promise<Member> {
    const existing = await this.memberRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Membro com ID "${id}" não encontrado.`);
    }

    return this.memberRepository.update(id, {
      fullName: dto.fullName,
      email: dto.email,
      phone: dto.phone,
      birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
      gender: dto.gender,
      maritalStatus: dto.maritalStatus,
      address: dto.address,
      membershipDate: dto.membershipDate ? new Date(dto.membershipDate) : undefined,
      baptismDate: dto.baptismDate ? new Date(dto.baptismDate) : undefined,
      status: dto.status,
      ministry: dto.ministry,
      notes: dto.notes,
    });
  }
}
