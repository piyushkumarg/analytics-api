import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Request } from 'express';
import { ApiKey } from '../../entities/api-key.entity';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    @InjectModel(ApiKey)
    private apiKeyModel: typeof ApiKey,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
      throw new UnauthorizedException('API key is missing');
    }

    const validKey = await this.apiKeyModel.findOne({
      where: {
        key: apiKey,
        is_active: true,
      },
    });

    if (!validKey) {
      throw new UnauthorizedException('Invalid or inactive API key');
    }

    // Attach API key details to request if needed
    req.apiKey = validKey;

    return true;
  }
}
