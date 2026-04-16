import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UpdateChurchWorshipUseCase } from '../application/update-church-worship/update-church-worship.usecase.js';
import { UpdateChurchWorshipDto } from '../application/update-church-worship/update-church-worship.dto.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Church Worships')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/worships')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UpdateChurchWorshipController {
  constructor(private readonly updateChurchWorshipUseCase: UpdateChurchWorshipUseCase) {}

  @Patch(':id')
  @RequiredPermissions('worship')
  @ApiOperation({ summary: 'Atualizar um culto da igreja' })
  async handle(@Param('id') id: string, @Body() dto: UpdateChurchWorshipDto) {
    return this.updateChurchWorshipUseCase.execute(id, dto);
  }
}
