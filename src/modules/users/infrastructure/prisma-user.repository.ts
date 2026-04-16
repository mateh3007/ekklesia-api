import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service.js';
import { UserRepository } from '../domain/user.repository.js';
import { User, UserRole } from '../domain/user.entity.js';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    const record = await this.prisma.user.create({
      data: {
        churchId: user.churchId,
        branchId: user.branchId,
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        isActive: user.isActive ?? true,
      },
    });
    return this.toEntity(record);
  }

  async findById(id: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { id } });
    return record ? this.toEntity(record) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { email } });
    return record ? this.toEntity(record) : null;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const record = await this.prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        password: data.password,
        role: data.role,
        branchId: data.branchId,
      },
    });
    return this.toEntity(record);
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async findAllByChurchId(churchId: string): Promise<User[]> {
    const records = await this.prisma.user.findMany({
      where: { churchId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return records.map(this.toEntity);
  }

  private toEntity(record: any): User {
    return new User({
      id: record.id,
      churchId: record.churchId,
      branchId: record.branchId ?? undefined,
      name: record.name,
      email: record.email,
      password: record.password,
      role: record.role as UserRole,
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
