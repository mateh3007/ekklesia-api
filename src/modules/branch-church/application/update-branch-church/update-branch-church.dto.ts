import { IsOptional, IsString } from 'class-validator';

export class UpdateBranchChurchDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}
