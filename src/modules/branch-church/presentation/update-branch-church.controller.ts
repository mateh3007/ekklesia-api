import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UpdateBranchChurchUseCase } from '../application/update-branch-church/update-branch-church.usecase.js';
import { UpdateBranchChurchDto } from '../application/update-branch-church/update-branch-church.dto.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Branch Churches')
@ApiBearerAuth('access-token')
@Controller('branch-churches')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UpdateBranchChurchController {
  constructor(private readonly updateBranchChurchUseCase: UpdateBranchChurchUseCase) {}

  @Patch(':id')
  @RequiredPermissions('branches')
  @ApiOperation({ summary: 'Atualizar dados de uma filial' })
  async handle(@Param('id') id: string, @Body() dto: UpdateBranchChurchDto) {
    return this.updateBranchChurchUseCase.execute(id, dto);
  }
}
