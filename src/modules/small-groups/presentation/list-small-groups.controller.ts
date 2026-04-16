import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListSmallGroupsUseCase } from '../application/list-small-groups/list-small-groups.usecase.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Small Groups')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/small-groups')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ListSmallGroupsController {
  constructor(private readonly listSmallGroupsUseCase: ListSmallGroupsUseCase) {}

  @Get()
  @RequiredPermissions('small-groups')
  @ApiOperation({ summary: 'Listar células da igreja' })
  async handle(@Param('churchId') churchId: string) {
    return this.listSmallGroupsUseCase.execute(churchId);
  }
}
