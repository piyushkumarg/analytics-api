import { Request } from 'express';
import { ApiKey } from '../entities/api-key.entity';

declare module 'express' {
  export interface Request {
    apiKey?: ApiKey;
  }
}
