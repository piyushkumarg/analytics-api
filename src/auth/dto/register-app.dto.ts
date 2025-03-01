import { IsString, IsNotEmpty } from 'class-validator';

export class RegisterAppDto {
  @IsString()
  @IsNotEmpty()
  app_name: string;
}
