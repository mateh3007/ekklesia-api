import { Injectable, NotFoundException } from '@nestjs/common';
import { ChurchRepository } from '../../domain/church.repository.js';
import { Church } from '../../domain/church.entity.js';

@Injectable()
export class FindChurchByIdUseCase {
  constructor(private readonly churchRepository: ChurchRepository) {}

  async execute(id: string): Promise<Church> {
    const church = await this.churchRepository.findById(id);

    if (!church) {
      throw new NotFoundException(`Igreja com id "${id}" não encontrada.`);
    }

    return church;
  }
}
