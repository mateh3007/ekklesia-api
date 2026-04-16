import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AssignSmallGroupUseCase } from '../application/assign-small-group/assign-small-group.usecase.js';
import { AssignSmallGroupDto } from '../application/assign-small-group/assign-small-group.dto.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Members')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/members')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AssignSmallGroupController {
  constructor(private readonly assignSmallGroupUseCase: AssignSmallGroupUseCase) {}

  @Patch(':id/small-group')
  @RequiredPermissions('members')
  @ApiOperation({ summary: 'Adicionar ou remover membro de uma célula' })
  async handle(@Param('id') id: string, @Body() dto: AssignSmallGroupDto) {
    return this.assignSmallGroupUseCase.execute(id, dto);
  }
}
