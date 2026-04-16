import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBranchChurchDto {
  @IsString()
  @IsNotEmpty()
  churchId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}
