import { Injectable, NotFoundException } from '@nestjs/common';
import { VisitorRepository } from '../../domain/visitor.repository.js';
import { Visitor } from '../../domain/visitor.entity.js';

@Injectable()
export class FindVisitorByIdUseCase {
  constructor(private readonly visitorRepository: VisitorRepository) {}

  async execute(id: string): Promise<Visitor> {
    const visitor = await this.visitorRepository.findById(id);

    if (!visitor) {
      throw new NotFoundException(`Visitante com ID "${id}" não encontrado.`);
    }

    return visitor;
  }
}
