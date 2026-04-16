import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FindChurchByIdUseCase } from '../application/find-church-by-id/find-church-by-id.usecase.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Churches')
@ApiBearerAuth('access-token')
@Controller('churches')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FindChurchByIdController {
  constructor(private readonly findChurchByIdUseCase: FindChurchByIdUseCase) {}

  @Get(':id')
  @RequiredPermissions('church')
  @ApiOperation({ summary: 'Buscar igreja por ID' })
  async handle(@Param('id') id: string) {
    return this.findChurchByIdUseCase.execute(id);
  }
}
