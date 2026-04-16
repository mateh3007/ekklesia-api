import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service.js';
import { MemberFollowUpRepository } from '../domain/member-follow-up.repository.js';
import { MemberFollowUp, FollowUpType } from '../domain/member-follow-up.entity.js';

@Injectable()
export class PrismaMemberFollowUpRepository implements MemberFollowUpRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(followUp: MemberFollowUp): Promise<MemberFollowUp> {
    const record = await this.prisma.memberFollowUp.create({
      data: {
        churchId: followUp.churchId,
        memberId: followUp.memberId,
        type: followUp.type,
        description: followUp.description,
        createdBy: followUp.createdBy,
      },
    });
    return this.toEntity(record);
  }

  async findById(id: string): Promise<MemberFollowUp | null> {
    const record = await this.prisma.memberFollowUp.findFirst({
      where: { id, deletedAt: null },
    });
    return record ? this.toEntity(record) : null;
  }

  async findAllByMemberId(memberId: string): Promise<MemberFollowUp[]> {
    const records = await this.prisma.memberFollowUp.findMany({
      where: { memberId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r) => this.toEntity(r));
  }

  async update(id: string, data: Partial<MemberFollowUp>): Promise<MemberFollowUp> {
    const record = await this.prisma.memberFollowUp.update({
      where: { id },
      data: {
        type: data.type,
        description: data.description,
      },
    });
    return this.toEntity(record);
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.memberFollowUp.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  private toEntity(record: any): MemberFollowUp {
    return new MemberFollowUp({
      id: record.id,
      churchId: record.churchId,
      memberId: record.memberId,
      type: record.type as FollowUpType,
      description: record.description,
      createdBy: record.createdBy,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      deletedAt: record.deletedAt ?? undefined,
    });
  }
}
