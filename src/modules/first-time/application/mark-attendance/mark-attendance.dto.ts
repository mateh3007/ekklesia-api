import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, IsNotEmpty } from 'class-validator';

export class MarkAttendanceDto {
  @ApiProperty({ example: 'clxxx...', description: 'ID do culto' })
  @IsString()
  @IsNotEmpty()
  worshipId: string;

  @ApiProperty({ example: '2026-04-13', description: 'Data da presença (YYYY-MM-DD)' })
  @IsDateString({}, { message: 'Data inválida. Use o formato YYYY-MM-DD.' })
  attendedAt: string;
}
