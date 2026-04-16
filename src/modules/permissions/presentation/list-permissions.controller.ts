import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ListPermissionsUseCase } from '../application/list-permissions/list-permissions.usecase.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Permissions')
@ApiBearerAuth('access-token')
@Controller('permissions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ListPermissionsController {
  constructor(private readonly listPermissionsUseCase: ListPermissionsUseCase) {}

  @Get()
  @RequiredPermissions('permissions')
  @ApiOperation({ summary: 'Listar todas as permissões' })
  async handle() {
    return this.listPermissionsUseCase.execute();
  }
}
