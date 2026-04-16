import { MemberFollowUp } from './member-follow-up.entity.js';

export abstract class MemberFollowUpRepository {
  abstract create(followUp: MemberFollowUp): Promise<MemberFollowUp>;
  abstract findById(id: string): Promise<MemberFollowUp | null>;
  abstract findAllByMemberId(memberId: string): Promise<MemberFollowUp[]>;
  abstract update(id: string, data: Partial<MemberFollowUp>): Promise<MemberFollowUp>;
  abstract softDelete(id: string): Promise<void>;
}
