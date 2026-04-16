import { ChurchWorship } from './church-worship.entity.js';

export abstract class ChurchWorshipRepository {
  abstract create(worship: ChurchWorship): Promise<ChurchWorship>;
  abstract findById(id: string): Promise<ChurchWorship | null>;
  abstract findAllByChurchId(churchId: string): Promise<ChurchWorship[]>;
  abstract update(id: string, data: Partial<ChurchWorship>): Promise<ChurchWorship>;
  abstract softDelete(id: string): Promise<void>;
}
