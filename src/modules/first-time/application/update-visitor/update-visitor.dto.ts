import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { VisitorStatus } from '../../domain/visitor.entity.js';

export class UpdateVisitorDto {
  @ApiPropertyOptional({ example: 'Maria da Silva' })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'O nome deve ter no mínimo 2 caracteres.' })
  name?: string;

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

  @ApiPropertyOptional({ enum: VisitorStatus })
  @IsOptional()
  @IsEnum(VisitorStatus, { message: 'Status inválido.' })
  status?: VisitorStatus;
}
