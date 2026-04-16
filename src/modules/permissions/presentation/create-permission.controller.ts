import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreatePermissionUseCase } from '../application/create-permission/create-permission.usecase.js';
import { CreatePermissionDto } from '../application/create-permission/create-permission.dto.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Permissions')
@ApiBearerAuth('access-token')
@Controller('permissions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CreatePermissionController {
  constructor(private readonly createPermissionUseCase: CreatePermissionUseCase) {}

  @Post()
  @RequiredPermissions('permissions')
  @ApiOperation({ summary: 'Criar uma nova permissão' })
  async handle(@Body() dto: CreatePermissionDto) {
    return this.createPermissionUseCase.execute(dto);
  }
}
