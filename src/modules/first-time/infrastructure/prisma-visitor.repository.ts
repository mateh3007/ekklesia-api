import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service.js';
import { VisitorRepository } from '../domain/visitor.repository.js';
import { Visitor, VisitorStatus } from '../domain/visitor.entity.js';

@Injectable()
export class PrismaVisitorRepository implements VisitorRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(visitor: Visitor): Promise<Visitor> {
    const record = await this.prisma.visitor.create({
      data: {
        churchId: visitor.churchId,
        name: visitor.name,
        email: visitor.email,
        phone: visitor.phone,
        birthDate: visitor.birthDate,
        firstVisitDate: visitor.firstVisitDate,
        status: visitor.status,
        isActive: visitor.isActive ?? true,
      },
    });
    return this.toEntity(record);
  }

  async findById(id: string): Promise<Visitor | null> {
    const record = await this.prisma.visitor.findUnique({ where: { id, isActive: true } });
    return record ? this.toEntity(record) : null;
  }

  async findAllByChurchId(churchId: string): Promise<Visitor[]> {
    const records = await this.prisma.visitor.findMany({
      where: { churchId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r) => this.toEntity(r));
  }

  async update(id: string, data: Partial<Visitor>): Promise<Visitor> {
    const record = await this.prisma.visitor.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        birthDate: data.birthDate,
        status: data.status,
      },
    });
    return this.toEntity(record);
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.visitor.update({
      where: { id },
      data: { isActive: false },
    });
  }

  private toEntity(record: any): Visitor {
    return new Visitor({
      id: record.id,
      churchId: record.churchId,
      name: record.name,
      email: record.email ?? undefined,
      phone: record.phone ?? undefined,
      birthDate: record.birthDate ?? undefined,
      firstVisitDate: record.firstVisitDate,
      status: record.status as VisitorStatus,
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
