import { Controller, Delete, HttpCode, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteSmallGroupUseCase } from '../application/delete-small-group/delete-small-group.usecase.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Small Groups')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/small-groups')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DeleteSmallGroupController {
  constructor(private readonly deleteSmallGroupUseCase: DeleteSmallGroupUseCase) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequiredPermissions('small-groups')
  @ApiOperation({ summary: 'Remover célula' })
  async handle(@Param('id') id: string) {
    return this.deleteSmallGroupUseCase.execute(id);
  }
}
