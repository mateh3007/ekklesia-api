import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service.js';
import { ChurchWorshipRepository } from '../domain/church-worship.repository.js';
import { ChurchWorship, DayOfWeek, WorshipFrequency } from '../domain/church-worship.entity.js';

@Injectable()
export class PrismaChurchWorshipRepository implements ChurchWorshipRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(worship: ChurchWorship): Promise<ChurchWorship> {
    const record = await this.prisma.churchWorship.create({
      data: {
        churchId: worship.churchId,
        name: worship.name,
        dayOfWeek: worship.dayOfWeek,
        frequency: worship.frequency,
        isActive: worship.isActive ?? true,
      },
    });
    return this.toEntity(record);
  }

  async findById(id: string): Promise<ChurchWorship | null> {
    const record = await this.prisma.churchWorship.findUnique({ where: { id, isActive: true } });
    return record ? this.toEntity(record) : null;
  }

  async findAllByChurchId(churchId: string): Promise<ChurchWorship[]> {
    const records = await this.prisma.churchWorship.findMany({
      where: { churchId, isActive: true },
      orderBy: { dayOfWeek: 'asc' },
    });
    return records.map((r) => this.toEntity(r));
  }

  async update(id: string, data: Partial<ChurchWorship>): Promise<ChurchWorship> {
    const record = await this.prisma.churchWorship.update({
      where: { id },
      data: {
        name: data.name,
        dayOfWeek: data.dayOfWeek,
        frequency: data.frequency,
      },
    });
    return this.toEntity(record);
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.churchWorship.update({
      where: { id },
      data: { isActive: false },
    });
  }

  private toEntity(record: any): ChurchWorship {
    return new ChurchWorship({
      id: record.id,
      churchId: record.churchId,
      name: record.name,
      dayOfWeek: record.dayOfWeek as DayOfWeek,
      frequency: record.frequency as WorshipFrequency,
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
