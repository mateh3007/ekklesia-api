import { Injectable } from '@nestjs/common';
import { SmallGroupRepository } from '../../domain/small-group.repository.js';
import { SmallGroup } from '../../domain/small-group.entity.js';

@Injectable()
export class ListSmallGroupsUseCase {
  constructor(private readonly smallGroupRepository: SmallGroupRepository) {}

  async execute(churchId: string): Promise<SmallGroup[]> {
    return this.smallGroupRepository.findAllByChurchId(churchId);
  }
}
