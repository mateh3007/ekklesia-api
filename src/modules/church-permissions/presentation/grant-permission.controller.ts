import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { GrantPermissionUseCase } from '../application/grant-permission/grant-permission.usecase.js';
import { GrantPermissionDto } from '../application/grant-permission/grant-permission.dto.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Church Permissions')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/permissions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class GrantPermissionController {
  constructor(private readonly grantPermissionUseCase: GrantPermissionUseCase) {}

  @Post()
  @RequiredPermissions('church-permissions')
  @ApiOperation({ summary: 'Conceder uma permissão a uma igreja' })
  async handle(@Param('churchId') churchId: string, @Body() dto: GrantPermissionDto) {
    return this.grantPermissionUseCase.execute(churchId, dto);
  }
}
