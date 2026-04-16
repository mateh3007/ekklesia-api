import { BaseEntity } from '../../../shared/domain/base.entity.js';

export enum VisitorStatus {
  NEW = 'NEW',
  RETURNING = 'RETURNING',
  MEMBER = 'MEMBER',
}

export class Visitor extends BaseEntity {
  churchId: string;
  name: string;
  email?: string;
  phone?: string;
  birthDate?: Date;
  firstVisitDate: Date;
  status: VisitorStatus;

  constructor(partial: Partial<Visitor>) {
    super(partial);
    Object.assign(this, partial);
  }
}
