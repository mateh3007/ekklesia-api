import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetDashboardUseCase } from '../application/get-dashboard/get-dashboard.usecase.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('First Time')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/first-time/dashboard')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class GetDashboardController {
  constructor(private readonly getDashboardUseCase: GetDashboardUseCase) {}

  @Get()
  @RequiredPermissions('first-time')
  @ApiOperation({ summary: 'Dashboard analítico de visitantes' })
  async handle(@Param('churchId') churchId: string) {
    return this.getDashboardUseCase.execute(churchId);
  }
}
