import { Injectable } from '@nestjs/common';
import { ChurchWorshipRepository } from '../../domain/church-worship.repository.js';
import { ChurchWorship } from '../../domain/church-worship.entity.js';

@Injectable()
export class ListChurchWorshipsUseCase {
  constructor(private readonly churchWorshipRepository: ChurchWorshipRepository) {}

  async execute(churchId: string): Promise<ChurchWorship[]> {
    return this.churchWorshipRepository.findAllByChurchId(churchId);
  }
}
