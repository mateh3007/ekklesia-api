import { Injectable } from '@nestjs/common';
import { Member, MemberStatus } from '../../domain/member.entity.js';
import {
  DashboardCounts,
  MemberRepository,
  MinistryCount,
} from '../../domain/member.repository.js';

export interface MembersDashboardAlerts {
  birthdaysThisWeek: Member[];
  awayMembers: Member[];
  underCareMembers: Member[];
  withoutUpdateDays: number;
  membersWithoutRecentUpdate: Member[];
}

export interface MembersDashboardResult {
  counts: DashboardCounts;
  ministryDistribution: MinistryCount[];
  alerts: MembersDashboardAlerts;
}

@Injectable()
export class GetMembersDashboardUseCase {
  constructor(private readonly memberRepository: MemberRepository) {}

  async execute(churchId: string, withoutUpdateDays = 30): Promise<MembersDashboardResult> {
    const [counts, ministryDistribution, birthdaysThisWeek, membersWithoutRecentUpdate, awayMembers, underCareMembers] =
      await Promise.all([
        this.memberRepository.getDashboardCounts(churchId),
        this.memberRepository.getMinistryDistribution(churchId),
        this.memberRepository.getBirthdaysThisWeek(churchId),
        this.memberRepository.getMembersWithoutRecentFollowUp(churchId, withoutUpdateDays),
        this.memberRepository.findAllByChurchId(churchId, { status: MemberStatus.AWAY }),
        this.memberRepository.findAllByChurchId(churchId, { status: MemberStatus.UNDER_CARE }),
      ]);

    return {
      counts,
      ministryDistribution,
      alerts: {
        birthdaysThisWeek,
        awayMembers,
        underCareMembers,
        withoutUpdateDays,
        membersWithoutRecentUpdate,
      },
    };
  }
}
