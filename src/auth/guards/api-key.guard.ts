import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const apiKey = req.headers['x-api-key'];
    const storedApiKey = this.config.get<string>('API_KEY'); // Fix here

    console.log('apiKey from header:', apiKey);
    console.log('this.config.get("API_KEY"):', storedApiKey); // Fix here

    return apiKey === storedApiKey;
  }
}
