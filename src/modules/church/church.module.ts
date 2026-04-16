import { Module } from '@nestjs/common';

import { ChurchRepository } from './domain/church.repository.js';
import { CreateChurchUseCase } from './application/create-church/create-church.usecase.js';
import { FindChurchByIdUseCase } from './application/find-church-by-id/find-church-by-id.usecase.js';
import { ListChurchesUseCase } from './application/list-churches/list-churches.usecase.js';
import { UpdateChurchUseCase } from './application/update-church/update-church.usecase.js';
import { DeleteChurchUseCase } from './application/delete-church/delete-church.usecase.js';
import { PrismaChurchRepository } from './infrastructure/prisma-church.repository.js';
import { CreateChurchController } from './presentation/create-church.controller.js';
import { FindChurchByIdController } from './presentation/find-church-by-id.controller.js';
import { ListChurchesController } from './presentation/list-churches.controller.js';
import { UpdateChurchController } from './presentation/update-church.controller.js';
import { DeleteChurchController } from './presentation/delete-church.controller.js';
import { JwtAuthGuard } from '../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../shared/presentation/guards/permissions.guard.js';

@Module({
  controllers: [
    CreateChurchController,
    FindChurchByIdController,
    ListChurchesController,
    UpdateChurchController,
    DeleteChurchController,
  ],
  providers: [
    CreateChurchUseCase,
    FindChurchByIdUseCase,
    ListChurchesUseCase,
    UpdateChurchUseCase,
    DeleteChurchUseCase,
    { provide: ChurchRepository, useClass: PrismaChurchRepository },
    JwtAuthGuard,
    PermissionsGuard,
  ],
  exports: [FindChurchByIdUseCase],
})
export class ChurchModule {}
