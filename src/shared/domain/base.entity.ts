export abstract class BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;

  constructor(partial: Partial<BaseEntity>) {
    Object.assign(this, partial);
  }
}
