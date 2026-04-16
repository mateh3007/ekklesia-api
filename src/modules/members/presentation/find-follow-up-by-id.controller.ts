import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindFollowUpByIdUseCase } from '../application/find-follow-up-by-id/find-follow-up-by-id.usecase.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Members')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/members/:memberId/follow-ups')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FindFollowUpByIdController {
  constructor(private readonly findFollowUpByIdUseCase: FindFollowUpByIdUseCase) {}

  @Get(':id')
  @RequiredPermissions('members')
  @ApiOperation({ summary: 'Buscar acompanhamento por ID' })
  async handle(@Param('id') id: string) {
    return this.findFollowUpByIdUseCase.execute(id);
  }
}
