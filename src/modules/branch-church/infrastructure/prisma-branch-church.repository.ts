import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service.js';
import { BranchChurchRepository } from '../domain/branch-church.repository.js';
import { BranchChurch } from '../domain/branch-church.entity.js';

@Injectable()
export class PrismaBranchChurchRepository implements BranchChurchRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(branch: BranchChurch): Promise<BranchChurch> {
    const record = await this.prisma.branchChurch.create({
      data: {
        churchId: branch.churchId,
        name: branch.name,
        address: branch.address,
        phone: branch.phone,
        isActive: branch.isActive ?? true,
      },
    });
    return this.toEntity(record);
  }

  async findById(id: string): Promise<BranchChurch | null> {
    const record = await this.prisma.branchChurch.findUnique({ where: { id } });
    return record ? this.toEntity(record) : null;
  }

  async update(id: string, data: Partial<BranchChurch>): Promise<BranchChurch> {
    const record = await this.prisma.branchChurch.update({
      where: { id },
      data: { name: data.name, address: data.address, phone: data.phone },
    });
    return this.toEntity(record);
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.branchChurch.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async findAllByChurchId(churchId: string): Promise<BranchChurch[]> {
    const records = await this.prisma.branchChurch.findMany({
      where: { churchId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return records.map(this.toEntity);
  }

  private toEntity(record: any): BranchChurch {
    return new BranchChurch({
      id: record.id,
      churchId: record.churchId,
      name: record.name,
      address: record.address ?? undefined,
      phone: record.phone ?? undefined,
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
