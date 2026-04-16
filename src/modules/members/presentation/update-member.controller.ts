import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateMemberUseCase } from '../application/update-member/update-member.usecase.js';
import { UpdateMemberDto } from '../application/update-member/update-member.dto.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Members')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/members')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UpdateMemberController {
  constructor(private readonly updateMemberUseCase: UpdateMemberUseCase) {}

  @Patch(':id')
  @RequiredPermissions('members')
  @ApiOperation({ summary: 'Atualizar dados de um membro' })
  async handle(@Param('id') id: string, @Body() dto: UpdateMemberDto) {
    return this.updateMemberUseCase.execute(id, dto);
  }
}
