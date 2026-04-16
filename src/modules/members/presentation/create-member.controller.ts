import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateMemberUseCase } from '../application/create-member/create-member.usecase.js';
import { CreateMemberDto } from '../application/create-member/create-member.dto.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Members')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/members')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CreateMemberController {
  constructor(private readonly createMemberUseCase: CreateMemberUseCase) {}

  @Post()
  @RequiredPermissions('members')
  @ApiOperation({ summary: 'Cadastrar um membro' })
  async handle(@Param('churchId') churchId: string, @Body() dto: CreateMemberDto) {
    return this.createMemberUseCase.execute(churchId, dto);
  }
}
