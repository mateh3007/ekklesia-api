import { Controller, Delete, HttpCode, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteFollowUpUseCase } from '../application/delete-follow-up/delete-follow-up.usecase.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Members')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/members/:memberId/follow-ups')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DeleteFollowUpController {
  constructor(private readonly deleteFollowUpUseCase: DeleteFollowUpUseCase) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequiredPermissions('members')
  @ApiOperation({ summary: 'Remover acompanhamento (soft delete)' })
  async handle(@Param('id') id: string) {
    return this.deleteFollowUpUseCase.execute(id);
  }
}
