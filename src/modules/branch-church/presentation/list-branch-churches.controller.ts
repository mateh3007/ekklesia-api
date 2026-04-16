import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ListBranchChurchesUseCase } from '../application/list-branch-churches/list-branch-churches.usecase.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Branch Churches')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/branches')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ListBranchChurchesController {
  constructor(private readonly listBranchChurchesUseCase: ListBranchChurchesUseCase) {}

  @Get()
  @RequiredPermissions('branches')
  @ApiOperation({ summary: 'Listar filiais de uma igreja' })
  async handle(@Param('churchId') churchId: string) {
    return this.listBranchChurchesUseCase.execute(churchId);
  }
}
