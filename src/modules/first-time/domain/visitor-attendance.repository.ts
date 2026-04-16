import { VisitorAttendance } from './visitor-attendance.entity.js';

export interface AttendancesByWeek {
  weekStart: string;
  count: number;
}

export interface TopWorship {
  worshipId: string;
  worshipName: string;
  count: number;
}

export interface FollowUpVisitor {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  firstVisitDate: Date;
  lastAttendedAt: Date;
  totalVisits: number;
}

export abstract class VisitorAttendanceRepository {
  abstract create(attendance: VisitorAttendance): Promise<VisitorAttendance>;
  abstract findByVisitorId(visitorId: string): Promise<VisitorAttendance[]>;
  abstract existsOnSameDay(visitorId: string, date: Date): Promise<boolean>;

  // Dashboard queries
  abstract countTotalVisitors(churchId: string): Promise<number>;
  abstract countNewVisitorsThisMonth(churchId: string): Promise<number>;
  abstract countReturningVisitors(churchId: string): Promise<number>;
  abstract getAttendancesByWeek(churchId: string, weeks: number): Promise<AttendancesByWeek[]>;
  abstract getTopWorships(churchId: string, limit: number): Promise<TopWorship[]>;
  abstract getFollowUpList(churchId: string): Promise<FollowUpVisitor[]>;
}
