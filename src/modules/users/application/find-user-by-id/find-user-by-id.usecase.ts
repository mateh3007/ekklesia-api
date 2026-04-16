import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../domain/user.repository.js';
import { User } from '../../domain/user.entity.js';

@Injectable()
export class FindUserByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`Usuário com id "${id}" não encontrado.`);
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
