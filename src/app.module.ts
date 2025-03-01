import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [CoreModule, AuthModule, AnalyticsModule],
})
export class AppModule {}
