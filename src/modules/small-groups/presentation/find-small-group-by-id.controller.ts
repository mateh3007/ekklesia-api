import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindSmallGroupByIdUseCase } from '../application/find-small-group-by-id/find-small-group-by-id.usecase.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('Small Groups')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/small-groups')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FindSmallGroupByIdController {
  constructor(private readonly findSmallGroupByIdUseCase: FindSmallGroupByIdUseCase) {}

  @Get(':id')
  @RequiredPermissions('small-groups')
  @ApiOperation({ summary: 'Buscar célula por ID' })
  async handle(@Param('id') id: string) {
    return this.findSmallGroupByIdUseCase.execute(id);
  }
}
