import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetApiKeysDto {
  @ApiPropertyOptional({
    description: 'Filter keys by application name',
    example: 'My Analytics Dashboard',
  })
  @IsString()
  @IsOptional()
  app_name?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Filter keys by is_active status',
    example: true,
  })
  is_active?: boolean;

  @ApiPropertyOptional({
    description: 'Filter keys by user ID (admin only)',
    example: 1,
  })
  @IsOptional()
  user_id?: number;
}
