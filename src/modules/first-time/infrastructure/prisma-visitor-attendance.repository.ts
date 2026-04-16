import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service.js';
import { VisitorAttendance } from '../domain/visitor-attendance.entity.js';
import {
  AttendancesByWeek,
  FollowUpVisitor,
  TopWorship,
  VisitorAttendanceRepository,
} from '../domain/visitor-attendance.repository.js';

@Injectable()
export class PrismaVisitorAttendanceRepository implements VisitorAttendanceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(attendance: VisitorAttendance): Promise<VisitorAttendance> {
    const record = await this.prisma.visitorAttendance.create({
      data: {
        visitorId: attendance.visitorId,
        worshipId: attendance.worshipId,
        churchId: attendance.churchId,
        attendedAt: attendance.attendedAt,
      },
    });
    return this.toEntity(record);
  }

  async findByVisitorId(visitorId: string): Promise<VisitorAttendance[]> {
    const records = await this.prisma.visitorAttendance.findMany({
      where: { visitorId },
      orderBy: { attendedAt: 'desc' },
    });
    return records.map((r) => this.toEntity(r));
  }

  async existsOnSameDay(visitorId: string, date: Date): Promise<boolean> {
    const count = await this.prisma.visitorAttendance.count({
      where: { visitorId, attendedAt: date },
    });
    return count > 0;
  }

  // ─── Dashboard ────────────────────────────────────────────────────────────────

  async countTotalVisitors(churchId: string): Promise<number> {
    return this.prisma.visitor.count({ where: { churchId, isActive: true } });
  }

  async countNewVisitorsThisMonth(churchId: string): Promise<number> {
    const start = new Date();
    start.setUTCDate(1);
    start.setUTCHours(0, 0, 0, 0);

    return this.prisma.visitor.count({
      where: { churchId, isActive: true, firstVisitDate: { gte: start } },
    });
  }

  async countReturningVisitors(churchId: string): Promise<number> {
    const groups = await this.prisma.visitorAttendance.groupBy({
      by: ['visitorId'],
      where: { churchId },
      having: { visitorId: { _count: { gte: 2 } } },
    });
    return groups.length;
  }

  async getAttendancesByWeek(churchId: string, weeks: number): Promise<AttendancesByWeek[]> {
    const rows = await this.prisma.$queryRaw<{ week: Date; count: bigint }[]>(
      Prisma.sql`
        SELECT
          DATE_TRUNC('week', "attendedAt") AS week,
          COUNT(*)                          AS count
        FROM visitor_attendances
        WHERE "churchId" = ${churchId}
          AND "attendedAt" >= NOW() - (${weeks} || ' weeks')::INTERVAL
        GROUP BY week
        ORDER BY week ASC
      `,
    );

    return rows.map((r) => ({
      weekStart: r.week.toISOString().split('T')[0],
      count: Number(r.count),
    }));
  }

  async getTopWorships(churchId: string, limit: number): Promise<TopWorship[]> {
    const groups = await this.prisma.visitorAttendance.groupBy({
      by: ['worshipId'],
      where: { churchId },
      _count: { worshipId: true },
      orderBy: { _count: { worshipId: 'desc' } },
      take: limit,
    });

    if (groups.length === 0) return [];

    const worships = await this.prisma.churchWorship.findMany({
      where: { id: { in: groups.map((g) => g.worshipId) } },
      select: { id: true, name: true },
    });

    const nameMap = Object.fromEntries(worships.map((w) => [w.id, w.name]));

    return groups.map((g) => ({
      worshipId: g.worshipId,
      worshipName: nameMap[g.worshipId] ?? 'Desconhecido',
      count: g._count.worshipId,
    }));
  }

  async getFollowUpList(churchId: string): Promise<FollowUpVisitor[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 30);
    thirtyDaysAgo.setUTCHours(0, 0, 0, 0);

    const rows = await this.prisma.$queryRaw<
      {
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
        firstVisitDate: Date;
        lastAttendedAt: Date;
        totalVisits: number;
      }[]
    >(
      Prisma.sql`
        SELECT
          v.id,
          v.name,
          v.phone,
          v.email,
          v."firstVisitDate",
          MAX(a."attendedAt")  AS "lastAttendedAt",
          COUNT(a.id)::int     AS "totalVisits"
        FROM visitors v
        JOIN visitor_attendances a ON a."visitorId" = v.id
        WHERE v."churchId"  = ${churchId}
          AND v."isActive"  = true
        GROUP BY v.id, v.name, v.phone, v.email, v."firstVisitDate"
        HAVING COUNT(a.id) = 1
           AND MAX(a."attendedAt") < ${thirtyDaysAgo}
        ORDER BY "lastAttendedAt" ASC
      `,
    );

    return rows;
  }

  private toEntity(record: any): VisitorAttendance {
    return new VisitorAttendance({
      id: record.id,
      visitorId: record.visitorId,
      worshipId: record.worshipId,
      churchId: record.churchId,
      attendedAt: record.attendedAt,
      createdAt: record.createdAt,
    });
  }
}
