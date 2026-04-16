import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListMembersUseCase } from '../application/list-members/list-members.usecase.js';
import { ListMembersFiltersDto } from '../application/list-members/list-members-filters.dto.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Members')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/members')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ListMembersController {
  constructor(private readonly listMembersUseCase: ListMembersUseCase) {}

  @Get()
  @RequiredPermissions('members')
  @ApiOperation({ summary: 'Listar membros com filtros avançados' })
  async handle(
    @Param('churchId') churchId: string,
    @Query() filters: ListMembersFiltersDto,
  ) {
    return this.listMembersUseCase.execute(churchId, filters);
  }
}
