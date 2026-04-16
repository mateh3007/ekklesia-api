import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service.js';
import { PermissionRepository } from '../domain/permission.repository.js';
import { Permission } from '../domain/permission.entity.js';

@Injectable()
export class PrismaPermissionRepository implements PermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(permission: Permission): Promise<Permission> {
    const record = await this.prisma.permission.create({
      data: {
        name: permission.name,
        description: permission.description,
        module: permission.module,
        action: permission.action,
      },
    });
    return this.toEntity(record);
  }

  async findById(id: string): Promise<Permission | null> {
    const record = await this.prisma.permission.findUnique({ where: { id } });
    return record ? this.toEntity(record) : null;
  }

  async findByName(name: string): Promise<Permission | null> {
    const record = await this.prisma.permission.findUnique({ where: { name } });
    return record ? this.toEntity(record) : null;
  }

  async findAll(): Promise<Permission[]> {
    const records = await this.prisma.permission.findMany({
      orderBy: [{ module: 'asc' }, { action: 'asc' }],
    });
    return records.map(this.toEntity);
  }

  async findByModule(module: string): Promise<Permission[]> {
    const records = await this.prisma.permission.findMany({
      where: { module },
      orderBy: { action: 'asc' },
    });
    return records.map(this.toEntity);
  }

  private toEntity(record: any): Permission {
    return new Permission({
      id: record.id,
      name: record.name,
      description: record.description ?? undefined,
      module: record.module,
      action: record.action,
      isActive: true,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
