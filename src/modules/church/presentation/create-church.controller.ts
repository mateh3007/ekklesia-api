import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateChurchUseCase } from '../application/create-church/create-church.usecase.js';
import { CreateChurchDto } from '../application/create-church/create-church.dto.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Churches')
@ApiBearerAuth('access-token')
@Controller('churches')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CreateChurchController {
  constructor(private readonly createChurchUseCase: CreateChurchUseCase) {}

  @Post()
  @RequiredPermissions('church')
  @ApiOperation({ summary: 'Criar uma nova igreja' })
  async handle(@Body() dto: CreateChurchDto) {
    return this.createChurchUseCase.execute(dto);
  }
}
