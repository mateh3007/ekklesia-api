import { Controller, Delete, HttpCode, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DeleteChurchUseCase } from '../application/delete-church/delete-church.usecase.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Churches')
@ApiBearerAuth('access-token')
@Controller('churches')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DeleteChurchController {
  constructor(private readonly deleteChurchUseCase: DeleteChurchUseCase) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequiredPermissions('church')
  @ApiOperation({ summary: 'Desativar uma igreja (soft delete)' })
  async handle(@Param('id') id: string) {
    return this.deleteChurchUseCase.execute(id);
  }
}
