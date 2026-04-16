import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { VisitorStatus } from '../../domain/visitor.entity.js';

export class CreateVisitorDto {
  @ApiProperty({ example: 'Maria da Silva' })
  @IsString()
  @MinLength(2, { message: 'O nome deve ter no mínimo 2 caracteres.' })
  name: string;

  @ApiPropertyOptional({ example: 'maria@email.com' })
  @IsOptional()
  @IsEmail({}, { message: 'E-mail inválido.' })
  email?: string;

  @ApiPropertyOptional({ example: '11999999999' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '1990-05-20' })
  @IsOptional()
  @IsDateString({}, { message: 'Data de nascimento inválida.' })
  birthDate?: string;

  @ApiProperty({ example: '2026-04-13' })
  @IsDateString({}, { message: 'Data da primeira visita inválida.' })
  firstVisitDate: string;

  @ApiPropertyOptional({ enum: VisitorStatus, default: VisitorStatus.NEW })
  @IsOptional()
  @IsEnum(VisitorStatus, { message: 'Status inválido.' })
  status?: VisitorStatus;
}
