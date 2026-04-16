import { BaseEntity } from '../../../shared/domain/base.entity.js';

export class ChurchPermission extends BaseEntity {
  churchId: string;
  permissionId: string;

  constructor(partial: Partial<ChurchPermission>) {
    super(partial);
    Object.assign(this, partial);
  }
}
