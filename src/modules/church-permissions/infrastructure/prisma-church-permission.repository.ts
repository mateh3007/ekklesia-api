import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service.js';
import { ChurchPermissionRepository } from '../domain/church-permission.repository.js';
import { ChurchPermission } from '../domain/church-permission.entity.js';

@Injectable()
export class PrismaChurchPermissionRepository
  implements ChurchPermissionRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async grant(
    churchId: string,
    permissionId: string,
  ): Promise<ChurchPermission> {
    const record = await this.prisma.churchPermission.upsert({
      where: { churchId_permissionId: { churchId, permissionId } },
      update: { isActive: true },
      create: { churchId, permissionId, isActive: true },
    });
    return this.toEntity(record);
  }

  async revoke(churchId: string, permissionId: string): Promise<void> {
    await this.prisma.churchPermission.update({
      where: { churchId_permissionId: { churchId, permissionId } },
      data: { isActive: false },
    });
  }

  async findAllByChurchId(churchId: string): Promise<ChurchPermission[]> {
    const records = await this.prisma.churchPermission.findMany({
      where: { churchId, isActive: true },
      include: { permission: true },
      orderBy: { createdAt: 'desc' },
    });
    return records.map(this.toEntity);
  }

  async grantByPermissionName(churchId: string, permissionName: string): Promise<void> {
    const permission = await this.prisma.permission.findFirstOrThrow({
      where: { name: permissionName },
    });
    await this.prisma.churchPermission.upsert({
      where: { churchId_permissionId: { churchId, permissionId: permission.id } },
      update: { isActive: true },
      create: { churchId, permissionId: permission.id, isActive: true },
    });
  }

  async findActivePermissionNames(churchId: string): Promise<string[]> {
    const records = await this.prisma.churchPermission.findMany({
      where: { churchId, isActive: true },
      include: { permission: true },
    });
    return records.map((r) => r.permission.name);
  }

  async hasPermission(
    churchId: string,
    permissionId: string,
  ): Promise<boolean> {
    const record = await this.prisma.churchPermission.findFirst({
      where: { churchId, permissionId, isActive: true },
    });
    return !!record;
  }

  private toEntity(record: any): ChurchPermission {
    return new ChurchPermission({
      id: record.id,
      churchId: record.churchId,
      permissionId: record.permissionId,
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
