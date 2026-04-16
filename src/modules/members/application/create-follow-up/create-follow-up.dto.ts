import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MinLength } from 'class-validator';
import { FollowUpType } from '../../domain/member-follow-up.entity.js';

export class CreateFollowUpDto {
  @ApiProperty({ enum: FollowUpType, example: FollowUpType.VISIT })
  @IsEnum(FollowUpType, { message: 'Tipo de acompanhamento inválido.' })
  type: FollowUpType;

  @ApiProperty({ example: 'Visitado em casa, estava bem animado para voltar.' })
  @IsString()
  @MinLength(3, { message: 'A descrição deve ter no mínimo 3 caracteres.' })
  description: string;
}
