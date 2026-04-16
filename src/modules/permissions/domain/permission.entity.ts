import { BaseEntity } from '../../../shared/domain/base.entity.js';

export class Permission extends BaseEntity {
  name: string;
  description?: string;
  module: string;
  action: string;

  constructor(partial: Partial<Permission>) {
    super(partial);
    Object.assign(this, partial);
  }
}
