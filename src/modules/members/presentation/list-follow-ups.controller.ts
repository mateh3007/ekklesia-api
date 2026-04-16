import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListFollowUpsUseCase } from '../application/list-follow-ups/list-follow-ups.usecase.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Members')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/members/:memberId/follow-ups')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ListFollowUpsController {
  constructor(private readonly listFollowUpsUseCase: ListFollowUpsUseCase) {}

  @Get()
  @RequiredPermissions('members')
  @ApiOperation({ summary: 'Listar acompanhamentos de um membro' })
  async handle(@Param('memberId') memberId: string) {
    return this.listFollowUpsUseCase.execute(memberId);
  }
}
