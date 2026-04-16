import { Injectable } from '@nestjs/common';
import { ChurchWorshipRepository } from '../../domain/church-worship.repository.js';
import { ChurchWorship } from '../../domain/church-worship.entity.js';
import { CreateChurchWorshipDto } from './create-church-worship.dto.js';

@Injectable()
export class CreateChurchWorshipUseCase {
  constructor(private readonly churchWorshipRepository: ChurchWorshipRepository) {}

  async execute(churchId: string, dto: CreateChurchWorshipDto): Promise<ChurchWorship> {
    const worship = new ChurchWorship({
      churchId,
      name: dto.name,
      dayOfWeek: dto.dayOfWeek,
      frequency: dto.frequency,
      isActive: true,
    });

    return this.churchWorshipRepository.create(worship);
  }
}
