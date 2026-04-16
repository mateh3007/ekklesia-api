import { Injectable } from '@nestjs/common';
import {
  AttendancesByWeek,
  FollowUpVisitor,
  TopWorship,
  VisitorAttendanceRepository,
} from '../../domain/visitor-attendance.repository.js';

export interface DashboardSummary {
  totalVisitors: number;
  newThisMonth: number;
  returningVisitors: number;
  retentionRate: number;
}

export interface DashboardResult {
  summary: DashboardSummary;
  weeklyTrend: AttendancesByWeek[];
  topWorships: TopWorship[];
  followUpList: FollowUpVisitor[];
}

@Injectable()
export class GetDashboardUseCase {
  constructor(private readonly attendanceRepository: VisitorAttendanceRepository) {}

  async execute(churchId: string): Promise<DashboardResult> {
    const [total, newThisMonth, returning, weeklyTrend, topWorships, followUpList] =
      await Promise.all([
        this.attendanceRepository.countTotalVisitors(churchId),
        this.attendanceRepository.countNewVisitorsThisMonth(churchId),
        this.attendanceRepository.countReturningVisitors(churchId),
        this.attendanceRepository.getAttendancesByWeek(churchId, 8),
        this.attendanceRepository.getTopWorships(churchId, 5),
        this.attendanceRepository.getFollowUpList(churchId),
      ]);

    const retentionRate = total > 0 ? Math.round((returning / total) * 100) : 0;

    return {
      summary: { totalVisitors: total, newThisMonth, returningVisitors: returning, retentionRate },
      weeklyTrend,
      topWorships,
      followUpList,
    };
  }
}
