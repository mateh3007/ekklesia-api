import { Module } from '@nestjs/common';
import { VisitorRepository } from './domain/visitor.repository.js';
import { VisitorAttendanceRepository } from './domain/visitor-attendance.repository.js';
import { PrismaVisitorRepository } from './infrastructure/prisma-visitor.repository.js';
import { PrismaVisitorAttendanceRepository } from './infrastructure/prisma-visitor-attendance.repository.js';
import { ChurchWorshipRepository } from '../church-worship/domain/church-worship.repository.js';
import { PrismaChurchWorshipRepository } from '../church-worship/infrastructure/prisma-church-worship.repository.js';
import { CreateVisitorUseCase } from './application/create-visitor/create-visitor.usecase.js';
import { FindVisitorByIdUseCase } from './application/find-visitor-by-id/find-visitor-by-id.usecase.js';
import { ListVisitorsUseCase } from './application/list-visitors/list-visitors.usecase.js';
import { UpdateVisitorUseCase } from './application/update-visitor/update-visitor.usecase.js';
import { DeleteVisitorUseCase } from './application/delete-visitor/delete-visitor.usecase.js';
import { MarkAttendanceUseCase } from './application/mark-attendance/mark-attendance.usecase.js';
import { ListAttendancesByVisitorUseCase } from './application/list-attendances-by-visitor/list-attendances-by-visitor.usecase.js';
import { GetDashboardUseCase } from './application/get-dashboard/get-dashboard.usecase.js';
import { CreateVisitorController } from './presentation/create-visitor.controller.js';
import { FindVisitorByIdController } from './presentation/find-visitor-by-id.controller.js';
import { ListVisitorsController } from './presentation/list-visitors.controller.js';
import { UpdateVisitorController } from './presentation/update-visitor.controller.js';
import { DeleteVisitorController } from './presentation/delete-visitor.controller.js';
import { MarkAttendanceController } from './presentation/mark-attendance.controller.js';
import { ListAttendancesByVisitorController } from './presentation/list-attendances-by-visitor.controller.js';
import { GetDashboardController } from './presentation/get-dashboard.controller.js';
import { JwtAuthGuard } from '../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../shared/presentation/guards/permissions.guard.js';

@Module({
  controllers: [
    CreateVisitorController,
    FindVisitorByIdController,
    ListVisitorsController,
    UpdateVisitorController,
    DeleteVisitorController,
    MarkAttendanceController,
    ListAttendancesByVisitorController,
    GetDashboardController,
  ],
  providers: [
    CreateVisitorUseCase,
    FindVisitorByIdUseCase,
    ListVisitorsUseCase,
    UpdateVisitorUseCase,
    DeleteVisitorUseCase,
    MarkAttendanceUseCase,
    ListAttendancesByVisitorUseCase,
    GetDashboardUseCase,
    { provide: VisitorRepository, useClass: PrismaVisitorRepository },
    { provide: VisitorAttendanceRepository, useClass: PrismaVisitorAttendanceRepository },
    { provide: ChurchWorshipRepository, useClass: PrismaChurchWorshipRepository },
    JwtAuthGuard,
    PermissionsGuard,
  ],
})
export class FirstTimeModule {}
