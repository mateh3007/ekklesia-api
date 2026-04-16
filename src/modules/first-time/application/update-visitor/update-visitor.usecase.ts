import { Injectable, NotFoundException } from '@nestjs/common';
import { VisitorRepository } from '../../domain/visitor.repository.js';
import { Visitor } from '../../domain/visitor.entity.js';
import { UpdateVisitorDto } from './update-visitor.dto.js';

@Injectable()
export class UpdateVisitorUseCase {
  constructor(private readonly visitorRepository: VisitorRepository) {}

  async execute(id: string, dto: UpdateVisitorDto): Promise<Visitor> {
    const existing = await this.visitorRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Visitante com ID "${id}" não encontrado.`);
    }

    return this.visitorRepository.update(id, {
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
      status: dto.status,
    });
  }
}
