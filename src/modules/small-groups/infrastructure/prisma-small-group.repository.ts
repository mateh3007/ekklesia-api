import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service.js';
import { SmallGroupRepository } from '../domain/small-group.repository.js';
import { SmallGroup, DayOfWeek, WorshipFrequency } from '../domain/small-group.entity.js';

@Injectable()
export class PrismaSmallGroupRepository implements SmallGroupRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(smallGroup: SmallGroup): Promise<SmallGroup> {
    const record = await this.prisma.smallGroup.create({
      data: {
        churchId: smallGroup.churchId,
        name: smallGroup.name,
        leaderUserId: smallGroup.leaderUserId,
        frequency: smallGroup.frequency,
        dayOfWeek: smallGroup.dayOfWeek,
        isActive: smallGroup.isActive ?? true,
      },
    });
    return this.toEntity(record);
  }

  async findById(id: string): Promise<SmallGroup | null> {
    const record = await this.prisma.smallGroup.findUnique({
      where: { id, isActive: true },
    });
    return record ? this.toEntity(record) : null;
  }

  async findAllByChurchId(churchId: string): Promise<SmallGroup[]> {
    const records = await this.prisma.smallGroup.findMany({
      where: { churchId, isActive: true },
      orderBy: { name: 'asc' },
    });
    return records.map((r) => this.toEntity(r));
  }

  async update(id: string, data: Partial<SmallGroup>): Promise<SmallGroup> {
    const record = await this.prisma.smallGroup.update({
      where: { id },
      data: {
        name: data.name,
        leaderUserId: data.leaderUserId,
        frequency: data.frequency,
        dayOfWeek: data.dayOfWeek,
      },
    });
    return this.toEntity(record);
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.smallGroup.update({
      where: { id },
      data: { isActive: false },
    });
  }

  private toEntity(record: any): SmallGroup {
    return new SmallGroup({
      id: record.id,
      churchId: record.churchId,
      name: record.name,
      leaderUserId: record.leaderUserId,
      frequency: record.frequency as WorshipFrequency,
      dayOfWeek: record.dayOfWeek as DayOfWeek,
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
