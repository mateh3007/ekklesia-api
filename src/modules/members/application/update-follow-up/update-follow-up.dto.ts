import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { FollowUpType } from '../../domain/member-follow-up.entity.js';

export class UpdateFollowUpDto {
  @ApiPropertyOptional({ enum: FollowUpType })
  @IsOptional()
  @IsEnum(FollowUpType, { message: 'Tipo de acompanhamento inválido.' })
  type?: FollowUpType;

  @ApiPropertyOptional({ example: 'Retornou à igreja no domingo seguinte.' })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'A descrição deve ter no mínimo 3 caracteres.' })
  description?: string;
}
