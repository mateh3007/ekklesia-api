import { Member, MemberStatus } from './member.entity.js';

export abstract class MemberRepository {
  abstract create(member: Member): Promise<Member>;
  abstract findById(id: string): Promise<Member | null>;
  abstract findAllByChurchId(churchId: string, status?: MemberStatus): Promise<Member[]>;
  abstract update(id: string, data: Partial<Member>): Promise<Member>;
  abstract softDelete(id: string): Promise<void>;
}
