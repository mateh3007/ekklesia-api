import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateVisitorUseCase } from '../application/create-visitor/create-visitor.usecase.js';
import { CreateVisitorDto } from '../application/create-visitor/create-visitor.dto.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('First Time')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/first-time/visitors')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CreateVisitorController {
  constructor(private readonly createVisitorUseCase: CreateVisitorUseCase) {}

  @Post()
  @RequiredPermissions('first-time')
  @ApiOperation({ summary: 'Cadastrar um visitante' })
  async handle(@Param('churchId') churchId: string, @Body() dto: CreateVisitorDto) {
    return this.createVisitorUseCase.execute(churchId, dto);
  }
}
