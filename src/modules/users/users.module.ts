import { Module } from '@nestjs/common';

import { UserRepository } from './domain/user.repository.js';
import { CreateUserUseCase } from './application/create-user/create-user.usecase.js';
import { FindUserByIdUseCase } from './application/find-user-by-id/find-user-by-id.usecase.js';
import { FindUserByEmailUseCase } from './application/find-user-by-email/find-user-by-email.usecase.js';
import { ListUsersUseCase } from './application/list-users/list-users.usecase.js';
import { UpdateUserUseCase } from './application/update-user/update-user.usecase.js';
import { DeleteUserUseCase } from './application/delete-user/delete-user.usecase.js';
import { PrismaUserRepository } from './infrastructure/prisma-user.repository.js';
import { CreateUserController } from './presentation/create-user.controller.js';
import { FindUserByIdController } from './presentation/find-user-by-id.controller.js';
import { ListUsersController } from './presentation/list-users.controller.js';
import { UpdateUserController } from './presentation/update-user.controller.js';
import { DeleteUserController } from './presentation/delete-user.controller.js';
import { JwtAuthGuard } from '../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../shared/presentation/guards/permissions.guard.js';

@Module({
  controllers: [
    CreateUserController,
    FindUserByIdController,
    ListUsersController,
    UpdateUserController,
    DeleteUserController,
  ],
  providers: [
    CreateUserUseCase,
    FindUserByIdUseCase,
    FindUserByEmailUseCase,
    ListUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    { provide: UserRepository, useClass: PrismaUserRepository },
    JwtAuthGuard,
    PermissionsGuard,
  ],
  exports: [FindUserByEmailUseCase, FindUserByIdUseCase],
})
export class UsersModule {}
