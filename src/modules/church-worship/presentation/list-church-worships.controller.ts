import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ListChurchWorshipsUseCase } from '../application/list-church-worships/list-church-worships.usecase.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Church Worships')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/worships')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ListChurchWorshipsController {
  constructor(private readonly listChurchWorshipsUseCase: ListChurchWorshipsUseCase) {}

  @Get()
  @RequiredPermissions('worship')
  @ApiOperation({ summary: 'Listar cultos de uma igreja' })
  async handle(@Param('churchId') churchId: string) {
    return this.listChurchWorshipsUseCase.execute(churchId);
  }
}
