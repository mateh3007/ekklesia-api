import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ListChurchPermissionsUseCase } from '../application/list-church-permissions/list-church-permissions.usecase.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Church Permissions')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/permissions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ListChurchPermissionsController {
  constructor(private readonly listChurchPermissionsUseCase: ListChurchPermissionsUseCase) {}

  @Get()
  @RequiredPermissions('church-permissions')
  @ApiOperation({ summary: 'Listar permissões de uma igreja' })
  async handle(@Param('churchId') churchId: string) {
    return this.listChurchPermissionsUseCase.execute(churchId);
  }
}
