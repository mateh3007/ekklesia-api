import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { GetMembersDashboardUseCase } from '../application/get-members-dashboard/get-members-dashboard.usecase.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

class DashboardQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  withoutUpdateDays?: number;
}

@ApiTags('Members')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/members/dashboard')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class GetMembersDashboardController {
  constructor(private readonly getDashboardUseCase: GetMembersDashboardUseCase) {}

  @Get()
  @RequiredPermissions('members')
  @ApiOperation({ summary: 'Dashboard analítico de membros e alertas' })
  @ApiQuery({
    name: 'withoutUpdateDays',
    required: false,
    type: Number,
    description: 'Dias sem acompanhamento para alerta (padrão: 30)',
  })
  async handle(
    @Param('churchId') churchId: string,
    @Query() query: DashboardQueryDto,
  ) {
    return this.getDashboardUseCase.execute(churchId, query.withoutUpdateDays);
  }
}
