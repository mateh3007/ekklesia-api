import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Gender, MaritalStatus, MemberStatus } from '../../domain/member.entity.js';

export class UpdateMemberDto {
  @ApiPropertyOptional({ example: 'Ana Paula Souza' })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'O nome deve ter no mínimo 2 caracteres.' })
  fullName?: string;

  @ApiPropertyOptional({ example: 'ana@email.com' })
  @IsOptional()
  @IsEmail({}, { message: 'E-mail inválido.' })
  email?: string;

  @ApiPropertyOptional({ example: '11999999999' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '1985-03-15' })
  @IsOptional()
  @IsDateString({}, { message: 'Data de nascimento inválida.' })
  birthDate?: string;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender, { message: 'Gênero inválido.' })
  gender?: Gender;

  @ApiPropertyOptional({ enum: MaritalStatus })
  @IsOptional()
  @IsEnum(MaritalStatus, { message: 'Estado civil inválido.' })
  maritalStatus?: MaritalStatus;

  @ApiPropertyOptional({ example: 'Rua das Flores, 123 - São Paulo/SP' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '2020-01-19' })
  @IsOptional()
  @IsDateString({}, { message: 'Data de membresia inválida.' })
  membershipDate?: string;

  @ApiPropertyOptional({ example: '2019-11-10' })
  @IsOptional()
  @IsDateString({}, { message: 'Data de batismo inválida.' })
  baptismDate?: string;

  @ApiPropertyOptional({ enum: MemberStatus })
  @IsOptional()
  @IsEnum(MemberStatus, { message: 'Status inválido.' })
  status?: MemberStatus;

  @ApiPropertyOptional({ example: 'Louvor' })
  @IsOptional()
  @IsString()
  ministry?: string;

  @ApiPropertyOptional({ example: 'Líder do grupo de jovens' })
  @IsOptional()
  @IsString()
  notes?: string;
}
