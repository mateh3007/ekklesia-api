import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service.js';
import { MemberRepository } from '../domain/member.repository.js';
import { Member, Gender, MaritalStatus, MemberStatus } from '../domain/member.entity.js';

@Injectable()
export class PrismaMemberRepository implements MemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(member: Member): Promise<Member> {
    const record = await this.prisma.member.create({
      data: {
        churchId: member.churchId,
        fullName: member.fullName,
        email: member.email ?? null,
        phone: member.phone,
        birthDate: member.birthDate,
        gender: member.gender,
        maritalStatus: member.maritalStatus,
        address: member.address ?? null,
        membershipDate: member.membershipDate,
        baptismDate: member.baptismDate ?? null,
        status: member.status,
        ministry: member.ministry ?? null,
        notes: member.notes ?? null,
      },
    });
    return this.toEntity(record);
  }

  async findById(id: string): Promise<Member | null> {
    const record = await this.prisma.member.findFirst({
      where: { id, deletedAt: null },
    });
    return record ? this.toEntity(record) : null;
  }

  async findAllByChurchId(churchId: string, status?: MemberStatus): Promise<Member[]> {
    const records = await this.prisma.member.findMany({
      where: {
        churchId,
        deletedAt: null,
        ...(status ? { status } : {}),
      },
      orderBy: { fullName: 'asc' },
    });
    return records.map((r) => this.toEntity(r));
  }

  async update(id: string, data: Partial<Member>): Promise<Member> {
    const record = await this.prisma.member.update({
      where: { id },
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        birthDate: data.birthDate,
        gender: data.gender,
        maritalStatus: data.maritalStatus,
        address: data.address,
        membershipDate: data.membershipDate,
        baptismDate: data.baptismDate,
        status: data.status,
        ministry: data.ministry,
        notes: data.notes,
      },
    });
    return this.toEntity(record);
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.member.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  private toEntity(record: any): Member {
    return new Member({
      id: record.id,
      churchId: record.churchId,
      fullName: record.fullName,
      email: record.email ?? undefined,
      phone: record.phone,
      birthDate: record.birthDate,
      gender: record.gender as Gender,
      maritalStatus: record.maritalStatus as MaritalStatus,
      address: record.address ?? undefined,
      membershipDate: record.membershipDate,
      baptismDate: record.baptismDate ?? undefined,
      status: record.status as MemberStatus,
      ministry: record.ministry ?? undefined,
      notes: record.notes ?? undefined,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      deletedAt: record.deletedAt ?? undefined,
    });
  }
}
