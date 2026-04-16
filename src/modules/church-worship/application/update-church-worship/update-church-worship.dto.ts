import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DayOfWeek, WorshipFrequency } from '../../domain/church-worship.entity.js';

export class UpdateChurchWorshipDto {
  @ApiPropertyOptional({ example: 'Culto da Família' })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'O nome deve ter no mínimo 2 caracteres.' })
  name?: string;

  @ApiPropertyOptional({ enum: DayOfWeek })
  @IsOptional()
  @IsEnum(DayOfWeek, { message: 'Dia da semana inválido.' })
  dayOfWeek?: DayOfWeek;

  @ApiPropertyOptional({ enum: WorshipFrequency })
  @IsOptional()
  @IsEnum(WorshipFrequency, { message: 'Frequência inválida.' })
  frequency?: WorshipFrequency;
}
