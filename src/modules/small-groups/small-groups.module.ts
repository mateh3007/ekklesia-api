import { Module } from '@nestjs/common';
import { SmallGroupRepository } from './domain/small-group.repository.js';
import { PrismaSmallGroupRepository } from './infrastructure/prisma-small-group.repository.js';
import { CreateSmallGroupUseCase } from './application/create-small-group/create-small-group.usecase.js';
import { FindSmallGroupByIdUseCase } from './application/find-small-group-by-id/find-small-group-by-id.usecase.js';
import { ListSmallGroupsUseCase } from './application/list-small-groups/list-small-groups.usecase.js';
import { UpdateSmallGroupUseCase } from './application/update-small-group/update-small-group.usecase.js';
import { DeleteSmallGroupUseCase } from './application/delete-small-group/delete-small-group.usecase.js';
import { CreateSmallGroupController } from './presentation/create-small-group.controller.js';
import { FindSmallGroupByIdController } from './presentation/find-small-group-by-id.controller.js';
import { ListSmallGroupsController } from './presentation/list-small-groups.controller.js';
import { UpdateSmallGroupController } from './presentation/update-small-group.controller.js';
import { DeleteSmallGroupController } from './presentation/delete-small-group.controller.js';
import { JwtAuthGuard } from '../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../shared/presentation/guards/permissions.guard.js';

@Module({
  controllers: [
    CreateSmallGroupController,
    FindSmallGroupByIdController,
    ListSmallGroupsController,
    UpdateSmallGroupController,
    DeleteSmallGroupController,
  ],
  providers: [
    CreateSmallGroupUseCase,
    FindSmallGroupByIdUseCase,
    ListSmallGroupsUseCase,
    UpdateSmallGroupUseCase,
    DeleteSmallGroupUseCase,
    { provide: SmallGroupRepository, useClass: PrismaSmallGroupRepository },
    JwtAuthGuard,
    PermissionsGuard,
  ],
})
export class SmallGroupsModule {}
