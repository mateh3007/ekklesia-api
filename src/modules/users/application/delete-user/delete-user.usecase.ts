import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../domain/user.repository.js';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.userRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Usuário com id "${id}" não encontrado.`);
    }

    await this.userRepository.softDelete(id);
  }
}
