import { IsString, IsNotEmpty } from 'class-validator';

export class UserStatsDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
