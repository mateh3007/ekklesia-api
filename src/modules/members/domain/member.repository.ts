import { Member, MemberStatus } from './member.entity.js';

export interface MemberFilters {
  name?: string;
  status?: MemberStatus;
  ministry?: string;
  minAge?: number;
  maxAge?: number;
  birthdayMonth?: number;
}

export interface DashboardCounts {
  total: number;
  active: number;
  inactive: number;
  away: number;
  underCare: number;
  newThisMonth: number;
  inSmallGroup: number;
  notInSmallGroup: number;
}

export interface MinistryCount {
  ministry: string;
  count: number;
}

export abstract class MemberRepository {
  abstract create(member: Member): Promise<Member>;
  abstract findById(id: string): Promise<Member | null>;
  abstract findAllByChurchId(churchId: string, filters?: MemberFilters): Promise<Member[]>;
  abstract update(id: string, data: Partial<Member>): Promise<Member>;
  abstract softDelete(id: string): Promise<void>;

  abstract assignSmallGroup(memberId: string, smallGroupId: string | null): Promise<Member>;

  // Dashboard
  abstract getDashboardCounts(churchId: string): Promise<DashboardCounts>;
  abstract getMinistryDistribution(churchId: string): Promise<MinistryCount[]>;
  abstract getBirthdaysThisWeek(churchId: string): Promise<Member[]>;
  abstract getMembersWithoutRecentFollowUp(churchId: string, days: number): Promise<Member[]>;
}
