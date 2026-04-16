import { Module } from '@nestjs/common';
import { LoginUseCase } from './application/login/login.usecase.js';
import { RegisterUseCase } from './application/register/register.usecase.js';
import { LoginController } from './presentation/login.controller.js';
import { RegisterController } from './presentation/register.controller.js';
import { UsersModule } from '../users/users.module.js';
import { UserRepository } from '../users/domain/user.repository.js';
import { PrismaUserRepository } from '../users/infrastructure/prisma-user.repository.js';

@Module({
  imports: [UsersModule],
  controllers: [LoginController, RegisterController],
  providers: [
    LoginUseCase,
    RegisterUseCase,
    { provide: UserRepository, useClass: PrismaUserRepository },
  ],
})
export class AuthModule {}
