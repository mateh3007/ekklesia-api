import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service.js';
import { ChurchRepository } from '../domain/church.repository.js';
import { Church } from '../domain/church.entity.js';

@Injectable()
export class PrismaChurchRepository implements ChurchRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(church: Church): Promise<Church> {
    const record = await this.prisma.church.create({
      data: {
        name: church.name,
        document: church.document,
        email: church.email,
        phone: church.phone,
        address: church.address,
        isActive: church.isActive ?? true,
      },
    });
    return this.toEntity(record);
  }

  async findById(id: string): Promise<Church | null> {
    const record = await this.prisma.church.findUnique({ where: { id } });
    return record ? this.toEntity(record) : null;
  }

  async findByDocument(document: string): Promise<Church | null> {
    const record = await this.prisma.church.findUnique({
      where: { document },
    });
    return record ? this.toEntity(record) : null;
  }

  async findByEmail(email: string): Promise<Church | null> {
    const record = await this.prisma.church.findUnique({ where: { email } });
    return record ? this.toEntity(record) : null;
  }

  async update(id: string, data: Partial<Church>): Promise<Church> {
    const record = await this.prisma.church.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
      },
    });
    return this.toEntity(record);
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.church.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async findAll(): Promise<Church[]> {
    const records = await this.prisma.church.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return records.map(this.toEntity);
  }

  private toEntity(record: any): Church {
    return new Church({
      id: record.id,
      name: record.name,
      document: record.document,
      email: record.email,
      phone: record.phone ?? undefined,
      address: record.address ?? undefined,
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
