import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListAttendancesByVisitorUseCase } from '../application/list-attendances-by-visitor/list-attendances-by-visitor.usecase.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('First Time')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/first-time/visitors/:visitorId/attendances')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ListAttendancesByVisitorController {
  constructor(
    private readonly listAttendancesByVisitorUseCase: ListAttendancesByVisitorUseCase,
  ) {}

  @Get()
  @RequiredPermissions('first-time')
  @ApiOperation({ summary: 'Listar presenças de um visitante' })
  async handle(@Param('visitorId') visitorId: string) {
    return this.listAttendancesByVisitorUseCase.execute(visitorId);
  }
}
