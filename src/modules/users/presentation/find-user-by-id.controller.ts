import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FindUserByIdUseCase } from '../application/find-user-by-id/find-user-by-id.usecase.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FindUserByIdController {
  constructor(private readonly findUserByIdUseCase: FindUserByIdUseCase) {}

  @Get(':id')
  @RequiredPermissions('users')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  async handle(@Param('id') id: string) {
    return this.findUserByIdUseCase.execute(id);
  }
}
