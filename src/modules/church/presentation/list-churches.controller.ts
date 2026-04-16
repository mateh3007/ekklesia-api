import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ListChurchesUseCase } from '../application/list-churches/list-churches.usecase.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Churches')
@ApiBearerAuth('access-token')
@Controller('churches')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ListChurchesController {
  constructor(private readonly listChurchesUseCase: ListChurchesUseCase) {}

  @Get()
  @RequiredPermissions('church')
  @ApiOperation({ summary: 'Listar todas as igrejas ativas' })
  async handle() {
    return this.listChurchesUseCase.execute();
  }
}
