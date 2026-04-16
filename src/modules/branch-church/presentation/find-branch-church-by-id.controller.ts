import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FindBranchChurchByIdUseCase } from '../application/find-branch-church-by-id/find-branch-church-by-id.usecase.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Branch Churches')
@ApiBearerAuth('access-token')
@Controller('branch-churches')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FindBranchChurchByIdController {
  constructor(private readonly findBranchChurchByIdUseCase: FindBranchChurchByIdUseCase) {}

  @Get(':id')
  @RequiredPermissions('branches')
  @ApiOperation({ summary: 'Buscar filial por ID' })
  async handle(@Param('id') id: string) {
    return this.findBranchChurchByIdUseCase.execute(id);
  }
}
