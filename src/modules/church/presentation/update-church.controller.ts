import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UpdateChurchUseCase } from '../application/update-church/update-church.usecase.js';
import { UpdateChurchDto } from '../application/update-church/update-church.dto.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Churches')
@ApiBearerAuth('access-token')
@Controller('churches')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UpdateChurchController {
  constructor(private readonly updateChurchUseCase: UpdateChurchUseCase) {}

  @Patch(':id')
  @RequiredPermissions('church')
  @ApiOperation({ summary: 'Atualizar dados de uma igreja' })
  async handle(@Param('id') id: string, @Body() dto: UpdateChurchDto) {
    return this.updateChurchUseCase.execute(id, dto);
  }
}
