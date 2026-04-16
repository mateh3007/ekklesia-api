import { BranchChurch } from './branch-church.entity.js';

export abstract class BranchChurchRepository {
  abstract create(branch: BranchChurch): Promise<BranchChurch>;
  abstract findById(id: string): Promise<BranchChurch | null>;
  abstract update(
    id: string,
    data: Partial<BranchChurch>,
  ): Promise<BranchChurch>;
  abstract softDelete(id: string): Promise<void>;
  abstract findAllByChurchId(churchId: string): Promise<BranchChurch[]>;
}
