import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FindChurchWorshipByIdUseCase } from '../application/find-church-worship-by-id/find-church-worship-by-id.usecase.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Church Worships')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/worships')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FindChurchWorshipByIdController {
  constructor(private readonly findChurchWorshipByIdUseCase: FindChurchWorshipByIdUseCase) {}

  @Get(':id')
  @RequiredPermissions('worship')
  @ApiOperation({ summary: 'Buscar culto por ID' })
  async handle(@Param('id') id: string) {
    return this.findChurchWorshipByIdUseCase.execute(id);
  }
}
