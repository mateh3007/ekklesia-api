import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateBranchChurchUseCase } from '../application/create-branch-church/create-branch-church.usecase.js';
import { CreateBranchChurchDto } from '../application/create-branch-church/create-branch-church.dto.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Branch Churches')
@ApiBearerAuth('access-token')
@Controller('branch-churches')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CreateBranchChurchController {
  constructor(private readonly createBranchChurchUseCase: CreateBranchChurchUseCase) {}

  @Post()
  @RequiredPermissions('branches')
  @ApiOperation({ summary: 'Criar uma filial' })
  async handle(@Body() dto: CreateBranchChurchDto) {
    return this.createBranchChurchUseCase.execute(dto);
  }
}
