import { Injectable } from '@nestjs/common';
import { SmallGroupRepository } from '../../domain/small-group.repository.js';
import { SmallGroup } from '../../domain/small-group.entity.js';
import { CreateSmallGroupDto } from './create-small-group.dto.js';

@Injectable()
export class CreateSmallGroupUseCase {
  constructor(private readonly smallGroupRepository: SmallGroupRepository) {}

  async execute(churchId: string, dto: CreateSmallGroupDto): Promise<SmallGroup> {
    const smallGroup = new SmallGroup({
      churchId,
      name: dto.name,
      leaderUserId: dto.leaderUserId,
      frequency: dto.frequency,
      dayOfWeek: dto.dayOfWeek,
      isActive: true,
    });

    return this.smallGroupRepository.create(smallGroup);
  }
}
