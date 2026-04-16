import { Controller, Delete, HttpCode, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteMemberUseCase } from '../application/delete-member/delete-member.usecase.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Members')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/members')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DeleteMemberController {
  constructor(private readonly deleteMemberUseCase: DeleteMemberUseCase) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequiredPermissions('members')
  @ApiOperation({ summary: 'Remover um membro (soft delete)' })
  async handle(@Param('id') id: string) {
    return this.deleteMemberUseCase.execute(id);
  }
}
