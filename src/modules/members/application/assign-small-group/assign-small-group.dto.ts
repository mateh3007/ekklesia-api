import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AssignSmallGroupDto {
  @ApiPropertyOptional({
    example: 'cuid-da-celula',
    description: 'ID da célula. Envie null para remover o membro da célula.',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  smallGroupId: string | null;
}
