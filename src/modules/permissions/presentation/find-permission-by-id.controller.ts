import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FindPermissionByIdUseCase } from '../application/find-permission-by-id/find-permission-by-id.usecase.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Permissions')
@ApiBearerAuth('access-token')
@Controller('permissions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FindPermissionByIdController {
  constructor(private readonly findPermissionByIdUseCase: FindPermissionByIdUseCase) {}

  @Get(':id')
  @RequiredPermissions('permissions')
  @ApiOperation({ summary: 'Buscar permissão por ID' })
  async handle(@Param('id') id: string) {
    return this.findPermissionByIdUseCase.execute(id);
  }
}
