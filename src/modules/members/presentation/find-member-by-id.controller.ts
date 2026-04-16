import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindMemberByIdUseCase } from '../application/find-member-by-id/find-member-by-id.usecase.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Members')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/members')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FindMemberByIdController {
  constructor(private readonly findMemberByIdUseCase: FindMemberByIdUseCase) {}

  @Get(':id')
  @RequiredPermissions('members')
  @ApiOperation({ summary: 'Buscar membro por ID' })
  async handle(@Param('id') id: string) {
    return this.findMemberByIdUseCase.execute(id);
  }
}
