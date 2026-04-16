import { Module } from '@nestjs/common';

import { BranchChurchRepository } from './domain/branch-church.repository.js';
import { CreateBranchChurchUseCase } from './application/create-branch-church/create-branch-church.usecase.js';
import { FindBranchChurchByIdUseCase } from './application/find-branch-church-by-id/find-branch-church-by-id.usecase.js';
import { ListBranchChurchesUseCase } from './application/list-branch-churches/list-branch-churches.usecase.js';
import { UpdateBranchChurchUseCase } from './application/update-branch-church/update-branch-church.usecase.js';
import { DeleteBranchChurchUseCase } from './application/delete-branch-church/delete-branch-church.usecase.js';
import { PrismaBranchChurchRepository } from './infrastructure/prisma-branch-church.repository.js';
import { CreateBranchChurchController } from './presentation/create-branch-church.controller.js';
import { FindBranchChurchByIdController } from './presentation/find-branch-church-by-id.controller.js';
import { ListBranchChurchesController } from './presentation/list-branch-churches.controller.js';
import { UpdateBranchChurchController } from './presentation/update-branch-church.controller.js';
import { DeleteBranchChurchController } from './presentation/delete-branch-church.controller.js';
import { JwtAuthGuard } from '../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../shared/presentation/guards/permissions.guard.js';

@Module({
  controllers: [
    CreateBranchChurchController,
    FindBranchChurchByIdController,
    ListBranchChurchesController,
    UpdateBranchChurchController,
    DeleteBranchChurchController,
  ],
  providers: [
    CreateBranchChurchUseCase,
    FindBranchChurchByIdUseCase,
    ListBranchChurchesUseCase,
    UpdateBranchChurchUseCase,
    DeleteBranchChurchUseCase,
    { provide: BranchChurchRepository, useClass: PrismaBranchChurchRepository },
    JwtAuthGuard,
    PermissionsGuard,
  ],
  exports: [FindBranchChurchByIdUseCase],
})
export class BranchChurchModule {}
