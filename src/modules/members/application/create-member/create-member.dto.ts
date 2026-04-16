import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Gender, MaritalStatus, MemberStatus } from '../../domain/member.entity.js';

export class CreateMemberDto {
  @ApiProperty({ example: 'Ana Paula Souza' })
  @IsString()
  @MinLength(2, { message: 'O nome deve ter no mínimo 2 caracteres.' })
  fullName: string;

  @ApiPropertyOptional({ example: 'ana@email.com' })
  @IsOptional()
  @IsEmail({}, { message: 'E-mail inválido.' })
  email?: string;

  @ApiProperty({ example: '11999999999' })
  @IsString()
  phone: string;

  @ApiProperty({ example: '1985-03-15' })
  @IsDateString({}, { message: 'Data de nascimento inválida.' })
  birthDate: string;

  @ApiProperty({ enum: Gender, example: Gender.FEMALE })
  @IsEnum(Gender, { message: 'Gênero inválido.' })
  gender: Gender;

  @ApiProperty({ enum: MaritalStatus, example: MaritalStatus.MARRIED })
  @IsEnum(MaritalStatus, { message: 'Estado civil inválido.' })
  maritalStatus: MaritalStatus;

  @ApiPropertyOptional({ example: 'Rua das Flores, 123 - São Paulo/SP' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: '2020-01-19', description: 'Data de entrada como membro' })
  @IsDateString({}, { message: 'Data de membresia inválida.' })
  membershipDate: string;

  @ApiPropertyOptional({ example: '2019-11-10' })
  @IsOptional()
  @IsDateString({}, { message: 'Data de batismo inválida.' })
  baptismDate?: string;

  @ApiPropertyOptional({ enum: MemberStatus, default: MemberStatus.ACTIVE })
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
