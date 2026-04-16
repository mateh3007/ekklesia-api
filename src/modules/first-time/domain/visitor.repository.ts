import { Visitor } from './visitor.entity.js';

export abstract class VisitorRepository {
  abstract create(visitor: Visitor): Promise<Visitor>;
  abstract findById(id: string): Promise<Visitor | null>;
  abstract findAllByChurchId(churchId: string): Promise<Visitor[]>;
  abstract update(id: string, data: Partial<Visitor>): Promise<Visitor>;
  abstract softDelete(id: string): Promise<void>;
}
