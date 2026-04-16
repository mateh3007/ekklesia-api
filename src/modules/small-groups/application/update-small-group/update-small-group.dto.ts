import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { DayOfWeek, WorshipFrequency } from '../../domain/small-group.entity.js';

export class UpdateSmallGroupDto {
  @ApiPropertyOptional({ example: 'Célula Zona Sul' })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'O nome deve ter no mínimo 2 caracteres.' })
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  leaderUserId?: string;

  @ApiPropertyOptional({ enum: WorshipFrequency })
  @IsOptional()
  @IsEnum(WorshipFrequency, { message: 'Frequência inválida.' })
  frequency?: WorshipFrequency;

  @ApiPropertyOptional({ enum: DayOfWeek })
  @IsOptional()
  @IsEnum(DayOfWeek, { message: 'Dia da semana inválido.' })
  dayOfWeek?: DayOfWeek;
}
