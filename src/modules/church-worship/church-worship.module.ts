import { Module } from '@nestjs/common';
import { ChurchWorshipRepository } from './domain/church-worship.repository.js';
import { PrismaChurchWorshipRepository } from './infrastructure/prisma-church-worship.repository.js';
import { CreateChurchWorshipUseCase } from './application/create-church-worship/create-church-worship.usecase.js';
import { FindChurchWorshipByIdUseCase } from './application/find-church-worship-by-id/find-church-worship-by-id.usecase.js';
import { ListChurchWorshipsUseCase } from './application/list-church-worships/list-church-worships.usecase.js';
import { UpdateChurchWorshipUseCase } from './application/update-church-worship/update-church-worship.usecase.js';
import { DeleteChurchWorshipUseCase } from './application/delete-church-worship/delete-church-worship.usecase.js';
import { CreateChurchWorshipController } from './presentation/create-church-worship.controller.js';
import { FindChurchWorshipByIdController } from './presentation/find-church-worship-by-id.controller.js';
import { ListChurchWorshipsController } from './presentation/list-church-worships.controller.js';
import { UpdateChurchWorshipController } from './presentation/update-church-worship.controller.js';
import { DeleteChurchWorshipController } from './presentation/delete-church-worship.controller.js';
import { JwtAuthGuard } from '../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../shared/presentation/guards/permissions.guard.js';

@Module({
  controllers: [
    CreateChurchWorshipController,
    FindChurchWorshipByIdController,
    ListChurchWorshipsController,
    UpdateChurchWorshipController,
    DeleteChurchWorshipController,
  ],
  providers: [
    CreateChurchWorshipUseCase,
    FindChurchWorshipByIdUseCase,
    ListChurchWorshipsUseCase,
    UpdateChurchWorshipUseCase,
    DeleteChurchWorshipUseCase,
    { provide: ChurchWorshipRepository, useClass: PrismaChurchWorshipRepository },
    JwtAuthGuard,
    PermissionsGuard,
  ],
})
export class ChurchWorshipModule {}
