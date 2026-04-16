import { Injectable } from '@nestjs/common';
import { VisitorRepository } from '../../domain/visitor.repository.js';
import { Visitor } from '../../domain/visitor.entity.js';

@Injectable()
export class ListVisitorsUseCase {
  constructor(private readonly visitorRepository: VisitorRepository) {}

  async execute(churchId: string): Promise<Visitor[]> {
    return this.visitorRepository.findAllByChurchId(churchId);
  }
}
