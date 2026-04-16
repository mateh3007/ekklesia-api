import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MarkAttendanceUseCase } from '../application/mark-attendance/mark-attendance.usecase.js';
import { MarkAttendanceDto } from '../application/mark-attendance/mark-attendance.dto.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('First Time')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/first-time/visitors/:visitorId/attendances')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MarkAttendanceController {
  constructor(private readonly markAttendanceUseCase: MarkAttendanceUseCase) {}

  @Post()
  @RequiredPermissions('first-time')
  @ApiOperation({ summary: 'Marcar presença de um visitante em um culto' })
  async handle(
    @Param('churchId') churchId: string,
    @Param('visitorId') visitorId: string,
    @Body() dto: MarkAttendanceDto,
  ) {
    return this.markAttendanceUseCase.execute(churchId, visitorId, dto);
  }
}
