import { IsString, IsNotEmpty } from 'class-validator';

export class RevokeKeyDto {
  @IsString()
  @IsNotEmpty()
  key_id: number;
}
