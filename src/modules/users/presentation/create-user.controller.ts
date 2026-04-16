import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateUserUseCase } from '../application/create-user/create-user.usecase.js';
import { CreateUserDto } from '../application/create-user/create-user.dto.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CreateUserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  @RequiredPermissions('users')
  @ApiOperation({ summary: 'Criar um novo usuário' })
  async handle(@Body() dto: CreateUserDto) {
    return this.createUserUseCase.execute(dto);
  }
}
