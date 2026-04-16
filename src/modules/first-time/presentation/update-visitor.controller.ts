import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateVisitorUseCase } from '../application/update-visitor/update-visitor.usecase.js';
import { UpdateVisitorDto } from '../application/update-visitor/update-visitor.dto.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('First Time')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/first-time/visitors')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UpdateVisitorController {
  constructor(private readonly updateVisitorUseCase: UpdateVisitorUseCase) {}

  @Patch(':id')
  @RequiredPermissions('first-time')
  @ApiOperation({ summary: 'Atualizar dados de um visitante' })
  async handle(@Param('id') id: string, @Body() dto: UpdateVisitorDto) {
    return this.updateVisitorUseCase.execute(id, dto);
  }
}
