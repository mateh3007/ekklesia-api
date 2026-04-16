import { Injectable } from '@nestjs/common';
import { MemberRepository } from '../../domain/member.repository.js';
import { Member, MemberStatus } from '../../domain/member.entity.js';
import { CreateMemberDto } from './create-member.dto.js';

@Injectable()
export class CreateMemberUseCase {
  constructor(private readonly memberRepository: MemberRepository) {}

  async execute(churchId: string, dto: CreateMemberDto): Promise<Member> {
    const member = new Member({
      churchId,
      fullName: dto.fullName,
      email: dto.email,
      phone: dto.phone,
      birthDate: new Date(dto.birthDate),
      gender: dto.gender,
      maritalStatus: dto.maritalStatus,
      address: dto.address,
      membershipDate: new Date(dto.membershipDate),
      baptismDate: dto.baptismDate ? new Date(dto.baptismDate) : undefined,
      status: dto.status ?? MemberStatus.ACTIVE,
      ministry: dto.ministry,
      notes: dto.notes,
    });

    return this.memberRepository.create(member);
  }
}
