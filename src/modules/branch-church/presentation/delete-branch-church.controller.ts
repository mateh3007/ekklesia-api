import { Controller, Delete, HttpCode, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DeleteBranchChurchUseCase } from '../application/delete-branch-church/delete-branch-church.usecase.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Branch Churches')
@ApiBearerAuth('access-token')
@Controller('branch-churches')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DeleteBranchChurchController {
  constructor(private readonly deleteBranchChurchUseCase: DeleteBranchChurchUseCase) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequiredPermissions('branches')
  @ApiOperation({ summary: 'Desativar uma filial (soft delete)' })
  async handle(@Param('id') id: string) {
    return this.deleteBranchChurchUseCase.execute(id);
  }
}
