import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetActivePermissionsUseCase } from '../application/get-active-permissions/get-active-permissions.usecase.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Church Permissions')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/permissions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class GetActivePermissionsController {
  constructor(private readonly getActivePermissionsUseCase: GetActivePermissionsUseCase) {}

  @Get('active')
  @RequiredPermissions('church')
  @ApiOperation({
    summary: 'Permissões ativas da igreja',
    description: 'Retorna os nomes das permissões/módulos ativos da igreja. Usado pelo front para controlar quais módulos exibir.',
  })
  async handle(@Param('churchId') churchId: string): Promise<string[]> {
    return this.getActivePermissionsUseCase.execute(churchId);
  }
}
