import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateSmallGroupUseCase } from '../application/create-small-group/create-small-group.usecase.js';
import { CreateSmallGroupDto } from '../application/create-small-group/create-small-group.dto.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Small Groups')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/small-groups')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CreateSmallGroupController {
  constructor(private readonly createSmallGroupUseCase: CreateSmallGroupUseCase) {}

  @Post()
  @RequiredPermissions('small-groups')
  @ApiOperation({ summary: 'Criar uma célula' })
  async handle(@Param('churchId') churchId: string, @Body() dto: CreateSmallGroupDto) {
    return this.createSmallGroupUseCase.execute(churchId, dto);
  }
}
