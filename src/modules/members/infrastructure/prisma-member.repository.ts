import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service.js';
import {
  DashboardCounts,
  MemberFilters,
  MemberRepository,
  MinistryCount,
} from '../domain/member.repository.js';
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

  async findAllByChurchId(churchId: string, filters?: MemberFilters): Promise<Member[]> {
    // birthdayMonth requer raw SQL — delegado para método separado
    if (filters?.birthdayMonth !== undefined) {
      return this.findWithBirthdayMonthFilter(churchId, filters);
    }

    const where: Prisma.MemberWhereInput = {
      churchId,
      deletedAt: null,
      ...(filters?.status && { status: filters.status }),
      ...(filters?.name && {
        fullName: { contains: filters.name, mode: 'insensitive' },
      }),
      ...(filters?.ministry && {
        ministry: { contains: filters.ministry, mode: 'insensitive' },
      }),
      ...(filters?.minAge !== undefined || filters?.maxAge !== undefined
        ? {
            birthDate: {
              ...(filters.maxAge !== undefined && {
                gte: this.ageToDate(filters.maxAge),
              }),
              ...(filters.minAge !== undefined && {
                lte: this.ageToDate(filters.minAge),
              }),
            },
          }
        : {}),
    };

    const records = await this.prisma.member.findMany({
      where,
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

  async assignSmallGroup(memberId: string, smallGroupId: string | null): Promise<Member> {
    const record = await this.prisma.member.update({
      where: { id: memberId },
      data: { smallGroupId },
    });
    return this.toEntity(record);
  }

  // ─── Dashboard ────────────────────────────────────────────────────────────────

  async getDashboardCounts(churchId: string): Promise<DashboardCounts> {
    const startOfMonth = new Date();
    startOfMonth.setUTCDate(1);
    startOfMonth.setUTCHours(0, 0, 0, 0);

    const [total, active, inactive, away, underCare, newThisMonth, inSmallGroup] = await Promise.all([
      this.prisma.member.count({ where: { churchId, deletedAt: null } }),
      this.prisma.member.count({ where: { churchId, deletedAt: null, status: 'ACTIVE' } }),
      this.prisma.member.count({ where: { churchId, deletedAt: null, status: 'INACTIVE' } }),
      this.prisma.member.count({ where: { churchId, deletedAt: null, status: 'AWAY' } }),
      this.prisma.member.count({ where: { churchId, deletedAt: null, status: 'UNDER_CARE' } }),
      this.prisma.member.count({
        where: { churchId, deletedAt: null, membershipDate: { gte: startOfMonth } },
      }),
      this.prisma.member.count({
        where: { churchId, deletedAt: null, smallGroupId: { not: null } },
      }),
    ]);

    return { total, active, inactive, away, underCare, newThisMonth, inSmallGroup, notInSmallGroup: total - inSmallGroup };
  }

  async getMinistryDistribution(churchId: string): Promise<MinistryCount[]> {
    const groups = await this.prisma.member.groupBy({
      by: ['ministry'],
      where: { churchId, deletedAt: null, ministry: { not: null } },
      _count: { ministry: true },
      orderBy: { _count: { ministry: 'desc' } },
    });

    return groups.map((g) => ({
      ministry: g.ministry as string,
      count: g._count.ministry,
    }));
  }

  async getBirthdaysThisWeek(churchId: string): Promise<Member[]> {
    // Calcular os 7 dias da semana atual (domingo a sábado)
    const today = new Date();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - today.getDay());
    sunday.setUTCHours(0, 0, 0, 0);

    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);

    // Gerar pares (month, day) para os 7 dias
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      return { month: d.getMonth() + 1, day: d.getDate() };
    });

    const conditions = weekDays
      .map((_, i) => `(EXTRACT(MONTH FROM "birthDate") = $${i * 2 + 2} AND EXTRACT(DAY FROM "birthDate") = $${i * 2 + 3})`)
      .join(' OR ');

    const params: (string | number)[] = [churchId];
    weekDays.forEach(({ month, day }) => params.push(month, day));

    const records = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM members WHERE "churchId" = $1 AND "deletedAt" IS NULL AND (${conditions}) ORDER BY EXTRACT(MONTH FROM "birthDate"), EXTRACT(DAY FROM "birthDate")`,
      ...params,
    );

    return records.map((r) => this.toEntity(r));
  }

  async getMembersWithoutRecentFollowUp(churchId: string, days: number): Promise<Member[]> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    cutoff.setUTCHours(0, 0, 0, 0);

    const records = await this.prisma.$queryRaw<any[]>(
      Prisma.sql`
        SELECT m.*
        FROM members m
        WHERE m."churchId" = ${churchId}
          AND m."deletedAt" IS NULL
          AND m."status" IN ('ACTIVE', 'AWAY', 'UNDER_CARE')
          AND (
            NOT EXISTS (
              SELECT 1 FROM member_follow_ups f
              WHERE f."memberId" = m.id AND f."deletedAt" IS NULL
            )
            OR (
              SELECT MAX(f."createdAt") FROM member_follow_ups f
              WHERE f."memberId" = m.id AND f."deletedAt" IS NULL
            ) < ${cutoff}
          )
        ORDER BY m."fullName" ASC
      `,
    );

    return records.map((r) => this.toEntity(r));
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  private async findWithBirthdayMonthFilter(
    churchId: string,
    filters: MemberFilters,
  ): Promise<Member[]> {
    const records = await this.prisma.$queryRaw<any[]>(
      Prisma.sql`
        SELECT * FROM members
        WHERE "churchId" = ${churchId}
          AND "deletedAt" IS NULL
          AND EXTRACT(MONTH FROM "birthDate") = ${filters.birthdayMonth}
          ${filters.status ? Prisma.sql`AND status = ${filters.status}::"MemberStatus"` : Prisma.empty}
          ${filters.name ? Prisma.sql`AND LOWER("fullName") LIKE ${'%' + filters.name.toLowerCase() + '%'}` : Prisma.empty}
          ${filters.ministry ? Prisma.sql`AND LOWER(ministry) LIKE ${'%' + filters.ministry.toLowerCase() + '%'}` : Prisma.empty}
        ORDER BY EXTRACT(DAY FROM "birthDate") ASC
      `,
    );

    let result = records.map((r) => this.toEntity(r));

    if (filters.minAge !== undefined) {
      const minBirth = this.ageToDate(filters.minAge);
      result = result.filter((m) => m.birthDate <= minBirth);
    }
    if (filters.maxAge !== undefined) {
      const maxBirth = this.ageToDate(filters.maxAge);
      result = result.filter((m) => m.birthDate >= maxBirth);
    }

    return result;
  }

  private ageToDate(age: number): Date {
    const d = new Date();
    d.setFullYear(d.getFullYear() - age);
    return d;
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
      smallGroupId: record.smallGroupId ?? undefined,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      deletedAt: record.deletedAt ?? undefined,
    });
  }
}
