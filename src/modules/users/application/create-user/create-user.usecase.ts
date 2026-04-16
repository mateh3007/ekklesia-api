import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from '../../domain/user.repository.js';
import { User, UserRole } from '../../domain/user.entity.js';
import { CreateUserDto } from './create-user.dto.js';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existing = await this.userRepository.findByEmail(dto.email);

    if (existing) {
      throw new ConflictException('Já existe um usuário com este e-mail.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = new User({
      churchId: dto.churchId,
      branchId: dto.branchId,
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: dto.role ?? UserRole.MEMBER,
      isActive: true,
    });

    const created = await this.userRepository.create(user);
    const { password: _, ...userWithoutPassword } = created;
    return userWithoutPassword;
  }
}
