import { BaseEntity } from '../../../shared/domain/base.entity.js';

export class BranchChurch extends BaseEntity {
  churchId: string;
  name: string;
  address?: string;
  phone?: string;

  constructor(partial: Partial<BranchChurch>) {
    super(partial);
    Object.assign(this, partial);
  }
}
