import { Injectable } from '@nestjs/common';
import { VisitorRepository } from '../../domain/visitor.repository.js';
import { Visitor, VisitorStatus } from '../../domain/visitor.entity.js';
import { CreateVisitorDto } from './create-visitor.dto.js';

@Injectable()
export class CreateVisitorUseCase {
  constructor(private readonly visitorRepository: VisitorRepository) {}

  async execute(churchId: string, dto: CreateVisitorDto): Promise<Visitor> {
    const visitor = new Visitor({
      churchId,
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
      firstVisitDate: new Date(dto.firstVisitDate),
      status: dto.status ?? VisitorStatus.NEW,
      isActive: true,
    });

    return this.visitorRepository.create(visitor);
  }
}
