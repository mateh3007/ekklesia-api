import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateSmallGroupUseCase } from '../application/update-small-group/update-small-group.usecase.js';
import { UpdateSmallGroupDto } from '../application/update-small-group/update-small-group.dto.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Small Groups')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/small-groups')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UpdateSmallGroupController {
  constructor(private readonly updateSmallGroupUseCase: UpdateSmallGroupUseCase) {}

  @Patch(':id')
  @RequiredPermissions('small-groups')
  @ApiOperation({ summary: 'Atualizar célula' })
  async handle(@Param('id') id: string, @Body() dto: UpdateSmallGroupDto) {
    return this.updateSmallGroupUseCase.execute(id, dto);
  }
}
