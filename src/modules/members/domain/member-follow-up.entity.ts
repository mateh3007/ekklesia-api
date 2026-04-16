export enum FollowUpType {
  VISIT = 'VISIT',
  COUNSELING = 'COUNSELING',
  PRAYER = 'PRAYER',
  OTHER = 'OTHER',
}

export class MemberFollowUp {
  id: string;
  churchId: string;
  memberId: string;
  type: FollowUpType;
  description: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(partial: Partial<MemberFollowUp>) {
    Object.assign(this, partial);
  }
}
