import { IsEnum, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DayOfWeek, WorshipFrequency } from '../../domain/church-worship.entity.js';

export class CreateChurchWorshipDto {
  @ApiProperty({ example: 'Culto de Domingo' })
  @IsString()
  @MinLength(2, { message: 'O nome deve ter no mínimo 2 caracteres.' })
  name: string;

  @ApiProperty({ enum: DayOfWeek, example: DayOfWeek.SUNDAY })
  @IsEnum(DayOfWeek, { message: 'Dia da semana inválido.' })
  dayOfWeek: DayOfWeek;

  @ApiProperty({ enum: WorshipFrequency, example: WorshipFrequency.WEEKLY })
  @IsEnum(WorshipFrequency, { message: 'Frequência inválida.' })
  frequency: WorshipFrequency;
}
