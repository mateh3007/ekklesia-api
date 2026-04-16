import { Injectable, NotFoundException } from '@nestjs/common';
import { VisitorRepository } from '../../domain/visitor.repository.js';

@Injectable()
export class DeleteVisitorUseCase {
  constructor(private readonly visitorRepository: VisitorRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.visitorRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Visitante com ID "${id}" não encontrado.`);
    }

    return this.visitorRepository.softDelete(id);
  }
}
