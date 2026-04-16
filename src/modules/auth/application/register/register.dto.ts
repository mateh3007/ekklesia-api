import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  // ─── Igreja ───────────────────────────────────────────────────────────────

  @ApiProperty({ example: 'Igreja Batista Central' })
  @IsString()
  @MinLength(2, { message: 'O nome da igreja deve ter no mínimo 2 caracteres.' })
  churchName: string;

  @ApiProperty({ example: '12.345.678/0001-99', description: 'CNPJ ou CPF da igreja' })
  @IsString()
  document: string;

  @ApiProperty({ example: 'contato@igrejabatista.com' })
  @IsEmail({}, { message: 'E-mail da igreja inválido.' })
  churchEmail: string;

  @ApiPropertyOptional({ example: '11999999999' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Rua das Flores, 123 - São Paulo/SP' })
  @IsOptional()
  @IsString()
  address?: string;

  // ─── Administrador ────────────────────────────────────────────────────────

  @ApiProperty({ example: 'João da Silva' })
  @IsString()
  @MinLength(2, { message: 'O nome do administrador deve ter no mínimo 2 caracteres.' })
  adminName: string;

  @ApiProperty({ example: 'joao@igrejabatista.com' })
  @IsEmail({}, { message: 'E-mail do administrador inválido.' })
  adminEmail: string;

  @ApiProperty({ example: 'senha@123', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  adminPassword: string;
}
