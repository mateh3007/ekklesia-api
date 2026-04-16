import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListVisitorsUseCase } from '../application/list-visitors/list-visitors.usecase.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('First Time')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/first-time/visitors')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ListVisitorsController {
  constructor(private readonly listVisitorsUseCase: ListVisitorsUseCase) {}

  @Get()
  @RequiredPermissions('first-time')
  @ApiOperation({ summary: 'Listar visitantes da igreja' })
  async handle(@Param('churchId') churchId: string) {
    return this.listVisitorsUseCase.execute(churchId);
  }
}
