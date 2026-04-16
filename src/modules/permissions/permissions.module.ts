import { Module } from '@nestjs/common';

import { PermissionRepository } from './domain/permission.repository.js';
import { CreatePermissionUseCase } from './application/create-permission/create-permission.usecase.js';
import { FindPermissionByIdUseCase } from './application/find-permission-by-id/find-permission-by-id.usecase.js';
import { ListPermissionsUseCase } from './application/list-permissions/list-permissions.usecase.js';
import { PrismaPermissionRepository } from './infrastructure/prisma-permission.repository.js';
import { CreatePermissionController } from './presentation/create-permission.controller.js';
import { FindPermissionByIdController } from './presentation/find-permission-by-id.controller.js';
import { ListPermissionsController } from './presentation/list-permissions.controller.js';
import { JwtAuthGuard } from '../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../shared/presentation/guards/permissions.guard.js';

@Module({
  controllers: [
    CreatePermissionController,
    FindPermissionByIdController,
    ListPermissionsController,
  ],
  providers: [
    CreatePermissionUseCase,
    FindPermissionByIdUseCase,
    ListPermissionsUseCase,
    { provide: PermissionRepository, useClass: PrismaPermissionRepository },
    JwtAuthGuard,
    PermissionsGuard,
  ],
  exports: [FindPermissionByIdUseCase],
})
export class PermissionsModule {}
