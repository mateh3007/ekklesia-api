import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../domain/user.entity.js';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsString()
  @IsOptional()
  branchId?: string;
}
