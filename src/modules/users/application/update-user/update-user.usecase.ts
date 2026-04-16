import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from '../../domain/user.repository.js';
import { User } from '../../domain/user.entity.js';
import { UpdateUserDto } from './update-user.dto.js';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, dto: UpdateUserDto): Promise<Omit<User, 'password'>> {
    const existing = await this.userRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Usuário com id "${id}" não encontrado.`);
    }

    const updateData: Partial<User> = {
      name: dto.name,
      role: dto.role,
      branchId: dto.branchId,
    };

    if (dto.password) {
      updateData.password = await bcrypt.hash(dto.password, 10);
    }

    const updated = await this.userRepository.update(id, updateData);
    const { password: _, ...userWithoutPassword } = updated;
    return userWithoutPassword;
  }
}
