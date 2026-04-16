import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsNotEmpty, MinLength } from 'class-validator';
import { DayOfWeek, WorshipFrequency } from '../../domain/small-group.entity.js';

export class CreateSmallGroupDto {
  @ApiProperty({ example: 'Célula Zona Norte' })
  @IsString()
  @MinLength(2, { message: 'O nome deve ter no mínimo 2 caracteres.' })
  name: string;

  @ApiProperty({ example: 'cuid-do-usuario-lider' })
  @IsString()
  @IsNotEmpty()
  leaderUserId: string;

  @ApiProperty({ enum: WorshipFrequency, example: WorshipFrequency.WEEKLY })
  @IsEnum(WorshipFrequency, { message: 'Frequência inválida.' })
  frequency: WorshipFrequency;

  @ApiProperty({ enum: DayOfWeek, example: DayOfWeek.FRIDAY })
  @IsEnum(DayOfWeek, { message: 'Dia da semana inválido.' })
  dayOfWeek: DayOfWeek;
}
