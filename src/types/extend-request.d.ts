import { Request } from 'express';
import { ApiKey } from '../entity/api-key.entity';

declare module 'express' {
  export interface Request {
    apiKey?: ApiKey;
  }
}
