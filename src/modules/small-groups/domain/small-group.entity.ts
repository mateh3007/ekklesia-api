import { BaseEntity } from '../../../shared/domain/base.entity.js';
import { DayOfWeek, WorshipFrequency } from '../../church-worship/domain/church-worship.entity.js';

export { DayOfWeek, WorshipFrequency };

export class SmallGroup extends BaseEntity {
  churchId: string;
  name: string;
  leaderUserId: string;
  frequency: WorshipFrequency;
  dayOfWeek: DayOfWeek;

  constructor(partial: Partial<SmallGroup>) {
    super(partial);
    Object.assign(this, partial);
  }
}
