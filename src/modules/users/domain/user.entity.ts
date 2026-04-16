import { BaseEntity } from '../../../shared/domain/base.entity.js';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export class User extends BaseEntity {
  churchId: string;
  branchId?: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;

  constructor(partial: Partial<User>) {
    super(partial);
    Object.assign(this, partial);
  }
}
