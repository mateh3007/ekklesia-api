import { Module } from '@nestjs/common';

import { ChurchPermissionRepository } from './domain/church-permission.repository.js';
import { GrantPermissionUseCase } from './application/grant-permission/grant-permission.usecase.js';
import { RevokePermissionUseCase } from './application/revoke-permission/revoke-permission.usecase.js';
import { ListChurchPermissionsUseCase } from './application/list-church-permissions/list-church-permissions.usecase.js';
import { PrismaChurchPermissionRepository } from './infrastructure/prisma-church-permission.repository.js';
import { GrantPermissionController } from './presentation/grant-permission.controller.js';
import { RevokePermissionController } from './presentation/revoke-permission.controller.js';
import { ListChurchPermissionsController } from './presentation/list-church-permissions.controller.js';
import { JwtAuthGuard } from '../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../shared/presentation/guards/permissions.guard.js';

@Module({
  controllers: [
    GrantPermissionController,
    RevokePermissionController,
    ListChurchPermissionsController,
  ],
  providers: [
    GrantPermissionUseCase,
    RevokePermissionUseCase,
    ListChurchPermissionsUseCase,
    {
      provide: ChurchPermissionRepository,
      useClass: PrismaChurchPermissionRepository,
    },
    JwtAuthGuard,
    PermissionsGuard,
  ],
})
export class ChurchPermissionsModule {}
