import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service.js';

export interface MembersOverview {
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
  birthdaysThisWeek: number;
}

export interface FirstTimeOverview {
  totalVisitors: number;
  newThisMonth: number;
  returningVisitors: number;
  retentionRate: number;
}

export interface OverviewDashboardResult {
  members?: MembersOverview;
  firstTime?: FirstTimeOverview;
}

@Injectable()
export class GetOverviewDashboardUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(churchId: string): Promise<OverviewDashboardResult> {
    const churchPermissions = await this.prisma.churchPermission.findMany({
      where: { churchId, isActive: true },
      include: { permission: true },
    });

    const permissions = new Set(churchPermissions.map((cp) => cp.permission.name));
    const result: OverviewDashboardResult = {};

    await Promise.all([
      permissions.has('members') &&
        this.getMembersOverview(churchId).then((data) => {
          result.members = data;
        }),
      permissions.has('first-time') &&
        this.getFirstTimeOverview(churchId).then((data) => {
          result.firstTime = data;
        }),
    ]);

    return result;
  }

  private async getMembersOverview(churchId: string): Promise<MembersOverview> {
    const startOfMonth = new Date();
    startOfMonth.setUTCDate(1);
    startOfMonth.setUTCHours(0, 0, 0, 0);

    const today = new Date();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - today.getDay());
    sunday.setUTCHours(0, 0, 0, 0);
    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);
    saturday.setUTCHours(23, 59, 59, 999);

    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      return { month: d.getMonth() + 1, day: d.getDate() };
    });

    const birthdayConditions = weekDays
      .map(
        (_, i) =>
          `(EXTRACT(MONTH FROM "birthDate") = $${i * 2 + 2} AND EXTRACT(DAY FROM "birthDate") = $${i * 2 + 3})`,
      )
      .join(' OR ');

    const birthdayParams: (string | number)[] = [churchId];
    weekDays.forEach(({ month, day }) => birthdayParams.push(month, day));

    const [total, active, inactive, newThisMonth, birthdayRows] = await Promise.all([
      this.prisma.member.count({ where: { churchId, deletedAt: null } }),
      this.prisma.member.count({ where: { churchId, deletedAt: null, status: 'ACTIVE' } }),
      this.prisma.member.count({ where: { churchId, deletedAt: null, status: 'INACTIVE' } }),
      this.prisma.member.count({
        where: { churchId, deletedAt: null, membershipDate: { gte: startOfMonth } },
      }),
      this.prisma.$queryRawUnsafe<{ id: string }[]>(
        `SELECT id FROM members WHERE "churchId" = $1 AND "deletedAt" IS NULL AND "birthDate" IS NOT NULL AND (${birthdayConditions})`,
        ...birthdayParams,
      ),
    ]);

    return { total, active, inactive, newThisMonth, birthdaysThisWeek: birthdayRows.length };
  }

  private async getFirstTimeOverview(churchId: string): Promise<FirstTimeOverview> {
    const startOfMonth = new Date();
    startOfMonth.setUTCDate(1);
    startOfMonth.setUTCHours(0, 0, 0, 0);

    const [totalVisitors, newThisMonth, returningRows] = await Promise.all([
      this.prisma.visitor.count({ where: { churchId, isActive: true } }),
      this.prisma.visitor.count({
        where: { churchId, isActive: true, firstVisitDate: { gte: startOfMonth } },
      }),
      this.prisma.visitorAttendance.groupBy({
        by: ['visitorId'],
        where: { churchId },
        having: { visitorId: { _count: { gt: 1 } } },
        _count: { visitorId: true },
      }),
    ]);

    const returningVisitors = returningRows.length;
    const retentionRate = totalVisitors > 0 ? Math.round((returningVisitors / totalVisitors) * 100) : 0;

    return { totalVisitors, newThisMonth, returningVisitors, retentionRate };
  }
}
