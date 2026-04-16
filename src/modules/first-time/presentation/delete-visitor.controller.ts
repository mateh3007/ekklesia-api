import { Controller, Delete, HttpCode, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteVisitorUseCase } from '../application/delete-visitor/delete-visitor.usecase.js';
import { JwtAuthGuard } from '../../../shared/presentation/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../../shared/presentation/guards/permissions.guard.js';
import { RequiredPermissions } from '../../../shared/presentation/decorators/required-permissions.decorator.js';

@ApiTags('First Time')
@ApiBearerAuth('access-token')
@Controller('churches/:churchId/first-time/visitors')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DeleteVisitorController {
  constructor(private readonly deleteVisitorUseCase: DeleteVisitorUseCase) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequiredPermissions('first-time')
  @ApiOperation({ summary: 'Remover um visitante' })
  async handle(@Param('id') id: string) {
    return this.deleteVisitorUseCase.execute(id);
  }
}
