import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { MemberStatus } from '../../domain/member.entity.js';

export class ListMembersFiltersDto {
  @ApiPropertyOptional({ example: 'Ana' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ enum: MemberStatus })
  @IsOptional()
  @IsEnum(MemberStatus, { message: 'Status inválido.' })
  status?: MemberStatus;

  @ApiPropertyOptional({ example: 'Louvor' })
  @IsOptional()
  @IsString()
  ministry?: string;

  @ApiPropertyOptional({ example: 18, description: 'Idade mínima' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minAge?: number;

  @ApiPropertyOptional({ example: 40, description: 'Idade máxima' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Max(120)
  maxAge?: number;

  @ApiPropertyOptional({ example: 4, description: 'Mês de aniversário (1-12)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  birthdayMonth?: number;
}
