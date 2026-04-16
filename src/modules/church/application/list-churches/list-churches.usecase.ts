import { Injectable } from '@nestjs/common';
import { ChurchRepository } from '../../domain/church.repository.js';
import { Church } from '../../domain/church.entity.js';

@Injectable()
export class ListChurchesUseCase {
  constructor(private readonly churchRepository: ChurchRepository) {}

  async execute(): Promise<Church[]> {
    return this.churchRepository.findAll();
  }
}
