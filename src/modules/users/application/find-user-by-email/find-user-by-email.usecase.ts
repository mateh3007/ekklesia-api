import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../domain/user.repository.js';
import { User } from '../../domain/user.entity.js';

@Injectable()
export class FindUserByEmailUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException(
        `Usuário com e-mail "${email}" não encontrado.`,
      );
    }

    return user;
  }
}
