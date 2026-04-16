import { BaseEntity } from '../../../shared/domain/base.entity.js';

export class Church extends BaseEntity {
  name: string;
  document: string;
  email: string;
  phone?: string;
  address?: string;

  constructor(partial: Partial<Church>) {
    super(partial);
    Object.assign(this, partial);
  }
}
