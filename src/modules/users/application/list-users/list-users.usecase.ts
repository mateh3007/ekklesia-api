import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/user.repository.js';
import { User } from '../../domain/user.entity.js';

@Injectable()
export class ListUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    churchId: string,
  ): Promise<Array<Omit<User, 'password'>>> {
    const users = await this.userRepository.findAllByChurchId(churchId);
    return users.map(({ password: _, ...user }) => user);
  }
}
