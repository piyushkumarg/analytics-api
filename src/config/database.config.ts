import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';

export const databaseConfig = (
  config: ConfigService,
): SequelizeModuleOptions => ({
  dialect: 'postgres',
  uri: config.get<string>('DATABASE_URL'),
  autoLoadModels: true,
  synchronize: true,
  ssl: true,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
