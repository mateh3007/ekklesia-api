import { Module } from '@nestjs/common';
import { GetOverviewDashboardUseCase } from './application/get-overview-dashboard/get-overview-dashboard.usecase.js';
import { GetOverviewDashboardController } from './presentation/get-overview-dashboard.controller.js';
import { JwtAuthGuard } from '../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../shared/presentation/guards/permissions.guard.js';

@Module({
  controllers: [GetOverviewDashboardController],
  providers: [GetOverviewDashboardUseCase, JwtAuthGuard, PermissionsGuard],
})
export class DashboardModule {}
