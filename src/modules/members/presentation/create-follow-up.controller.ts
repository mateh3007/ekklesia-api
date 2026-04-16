import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateFollowUpUseCase } from '../application/create-follow-up/create-follow-up.usecase.js';
import { CreateFollowUpDto } from '../application/create-follow-up/create-follow-up.dto.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';
import { CurrentUser, JwtPayload } from '../../../shared/presentation/decorators/current-user.decorator.js';

@ApiTags('Members')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/members/:memberId/follow-ups')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CreateFollowUpController {
  constructor(private readonly createFollowUpUseCase: CreateFollowUpUseCase) {}

  @Post()
  @RequiredPermissions('members')
  @ApiOperation({ summary: 'Registrar acompanhamento de um membro' })
  async handle(
    @Param('churchId') churchId: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateFollowUpDto,
  ) {
    return this.createFollowUpUseCase.execute(churchId, memberId, user.sub, dto);
  }
}
