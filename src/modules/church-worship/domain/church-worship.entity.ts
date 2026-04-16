import { BaseEntity } from '../../../shared/domain/base.entity.js';

export enum DayOfWeek {
  SUNDAY = 'SUNDAY',
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
}

export enum WorshipFrequency {
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  MONTHLY = 'MONTHLY',
}

export class ChurchWorship extends BaseEntity {
  churchId: string;
  name: string;
  dayOfWeek: DayOfWeek;
  frequency: WorshipFrequency;

  constructor(partial: Partial<ChurchWorship>) {
    super(partial);
    Object.assign(this, partial);
  }
}
