import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetOverviewDashboardUseCase } from '../application/get-overview-dashboard/get-overview-dashboard.usecase.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Dashboard')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/dashboard')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class GetOverviewDashboardController {
  constructor(private readonly getOverviewDashboardUseCase: GetOverviewDashboardUseCase) {}

  @Get()
  @RequiredPermissions('church')
  @ApiOperation({
    summary: 'Dashboard geral da igreja',
    description:
      'Retorna um resumo dos módulos disponíveis conforme as permissões ativas da igreja. Campos opcionais: members, firstTime.',
  })
  async handle(@Param('churchId') churchId: string) {
    return this.getOverviewDashboardUseCase.execute(churchId);
  }
}
