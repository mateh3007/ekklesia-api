import { SmallGroup } from './small-group.entity.js';

export abstract class SmallGroupRepository {
  abstract create(smallGroup: SmallGroup): Promise<SmallGroup>;
  abstract findById(id: string): Promise<SmallGroup | null>;
  abstract findAllByChurchId(churchId: string): Promise<SmallGroup[]>;
  abstract update(id: string, data: Partial<SmallGroup>): Promise<SmallGroup>;
  abstract softDelete(id: string): Promise<void>;
}
