import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsObject,
  IsOptional,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  event: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsOptional()
  referrer?: string;

  @IsString()
  @IsNotEmpty()
  device: string;

  @IsString()
  @IsNotEmpty()
  ipAddress: string;

  @IsDateString()
  @IsNotEmpty()
  timestamp: Date;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
