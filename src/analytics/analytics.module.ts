import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AnalyticsEvent } from 'src/entity/analytics-event.entity';
import { ApiKey } from 'src/entity/api-key.entity';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
@Module({
  imports: [SequelizeModule.forFeature([AnalyticsEvent, ApiKey])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, ApiKeyGuard],
  exports: [ApiKeyGuard],
})
export class AnalyticsModule {}
