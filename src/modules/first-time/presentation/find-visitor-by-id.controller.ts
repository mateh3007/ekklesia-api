import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindVisitorByIdUseCase } from '../application/find-visitor-by-id/find-visitor-by-id.usecase.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('First Time')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/first-time/visitors')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FindVisitorByIdController {
  constructor(private readonly findVisitorByIdUseCase: FindVisitorByIdUseCase) {}

  @Get(':id')
  @RequiredPermissions('first-time')
  @ApiOperation({ summary: 'Buscar visitante por ID' })
  async handle(@Param('id') id: string) {
    return this.findVisitorByIdUseCase.execute(id);
  }
}
