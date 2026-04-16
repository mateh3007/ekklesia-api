import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ListMembersUseCase } from '../application/list-members/list-members.usecase.js';
import { MemberStatus } from '../domain/member.entity.js';
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
  @ApiOperation({ summary: 'Listar membros da igreja' })
  @ApiQuery({ name: 'status', enum: MemberStatus, required: false })
  async handle(
    @Param('churchId') churchId: string,
    @Query('status') status?: MemberStatus,
  ) {
    return this.listMembersUseCase.execute(churchId, status);
  }
}
