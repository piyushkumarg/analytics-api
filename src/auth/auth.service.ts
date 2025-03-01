import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { RegisterAppDto } from './dto/register-app.dto';
import * as crypto from 'crypto';
import { User } from 'src/entity/user.entity';
import { ApiKey } from 'src/entity/api-key.entity';
import { Op } from 'sequelize';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(ApiKey)
    private apiKeyModel: typeof ApiKey,
    private jwtService: JwtService,
  ) {}

  private generateSecureKey(): string {
    const hash = crypto.randomBytes(32).toString('hex');
    return hash;
  }

  async findOrCreateUser(googleProfile: any): Promise<User> {
    const [user] = await this.userModel.findOrCreate({
      where: { google_id: googleProfile.id },
      defaults: {
        email: googleProfile.email,
        name: googleProfile.name,
      },
    });

    return user;
  }

  async generateApiKey(userId: number, dto: RegisterAppDto): Promise<ApiKey> {
    const key = await this.apiKeyModel.create({
      key: this.generateSecureKey(),
      app_name: dto.app_name,
      user_id: userId,
    });

    return JSON.parse(JSON.stringify(key));
  }

  async revokeApiKey(userId: number, keyId: number): Promise<void> {
    await this.apiKeyModel.update(
      { is_active: false },
      { where: { id: keyId, user_id: userId } },
    );
  }

  async getUserApiKeys(filters: {
    user_id: number;
    app_name?: string;
    is_active?: boolean;
  }): Promise<ApiKey[]> {
    const whereClause: any = {
      user_id: filters.user_id,
    };

    if (filters.app_name) {
      whereClause.app_name = {
        [Op.iLike]: `%${filters.app_name}%`, // Case-insensitive search
      };
    }

    if (filters.is_active !== undefined) {
      console.log(filters.is_active);
      whereClause.is_active = filters.is_active;
    }

    const result = await this.apiKeyModel.findAll({
      where: whereClause,
      attributes: ['id', 'app_name', 'key', 'createdAt', 'is_active'],
      order: [['createdAt', 'DESC']],
    });

    return result;
  }

  generateJwtToken(userId: number): string {
    return this.jwtService.sign({ sub: userId });
  }
}
