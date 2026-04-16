import { Church } from './church.entity.js';

export abstract class ChurchRepository {
  abstract create(church: Church): Promise<Church>;
  abstract findById(id: string): Promise<Church | null>;
  abstract findByDocument(document: string): Promise<Church | null>;
  abstract findByEmail(email: string): Promise<Church | null>;
  abstract update(id: string, data: Partial<Church>): Promise<Church>;
  abstract softDelete(id: string): Promise<void>;
  abstract findAll(): Promise<Church[]>;
}
