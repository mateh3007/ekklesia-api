import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateChurchWorshipUseCase } from '../application/create-church-worship/create-church-worship.usecase.js';
import { CreateChurchWorshipDto } from '../application/create-church-worship/create-church-worship.dto.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Church Worships')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/worships')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CreateChurchWorshipController {
  constructor(private readonly createChurchWorshipUseCase: CreateChurchWorshipUseCase) {}

  @Post()
  @RequiredPermissions('worship')
  @ApiOperation({ summary: 'Cadastrar um dia de culto da igreja' })
  async handle(@Param('churchId') churchId: string, @Body() dto: CreateChurchWorshipDto) {
    return this.createChurchWorshipUseCase.execute(churchId, dto);
  }
}
