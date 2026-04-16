import { Controller, Delete, HttpCode, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RevokePermissionUseCase } from '../application/revoke-permission/revoke-permission.usecase.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Church Permissions')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/permissions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RevokePermissionController {
  constructor(private readonly revokePermissionUseCase: RevokePermissionUseCase) {}

  @Delete(':permissionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequiredPermissions('church-permissions')
  @ApiOperation({ summary: 'Revogar uma permissão de uma igreja' })
  async handle(@Param('churchId') churchId: string, @Param('permissionId') permissionId: string) {
    return this.revokePermissionUseCase.execute(churchId, permissionId);
  }
}
