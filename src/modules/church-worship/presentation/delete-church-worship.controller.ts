import { Controller, Delete, HttpCode, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DeleteChurchWorshipUseCase } from '../application/delete-church-worship/delete-church-worship.usecase.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Church Worships')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/worships')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DeleteChurchWorshipController {
  constructor(private readonly deleteChurchWorshipUseCase: DeleteChurchWorshipUseCase) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequiredPermissions('worship')
  @ApiOperation({ summary: 'Remover um culto da igreja' })
  async handle(@Param('id') id: string) {
    return this.deleteChurchWorshipUseCase.execute(id);
  }
}
