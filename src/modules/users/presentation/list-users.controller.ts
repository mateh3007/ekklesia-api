import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ListUsersUseCase } from '../application/list-users/list-users.usecase.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ListUsersController {
  constructor(private readonly listUsersUseCase: ListUsersUseCase) {}

  @Get()
  @RequiredPermissions('users')
  @ApiOperation({ summary: 'Listar usuários de uma igreja' })
  async handle(@Param('churchId') churchId: string) {
    return this.listUsersUseCase.execute(churchId);
  }
}
