import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateFollowUpUseCase } from '../application/update-follow-up/update-follow-up.usecase.js';
import { UpdateFollowUpDto } from '../application/update-follow-up/update-follow-up.dto.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Members')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/members/:memberId/follow-ups')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UpdateFollowUpController {
  constructor(private readonly updateFollowUpUseCase: UpdateFollowUpUseCase) {}

  @Patch(':id')
  @RequiredPermissions('members')
  @ApiOperation({ summary: 'Atualizar acompanhamento de um membro' })
  async handle(@Param('id') id: string, @Body() dto: UpdateFollowUpDto) {
    return this.updateFollowUpUseCase.execute(id, dto);
  }
}
