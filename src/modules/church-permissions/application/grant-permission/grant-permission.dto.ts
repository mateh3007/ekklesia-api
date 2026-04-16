import { IsNotEmpty, IsString } from 'class-validator';

export class GrantPermissionDto {
  @IsString()
  @IsNotEmpty()
  permissionId: string;
}
