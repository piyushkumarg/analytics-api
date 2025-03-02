import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { CreateEventDto } from './dto/create-event.dto';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { EventSummaryDto } from './dto/event-summary.dto';
import { UserStatsDto } from './dto/user-stats.dto';

@ApiTags('Analytics')
@Controller('api/analytics')
@UseGuards(ApiKeyGuard)
@ApiHeader({ name: 'X-API-KEY' })
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('collect')
  @ApiResponse({ status: 201, description: 'Event recorded' })
  async create(@Body() createEventDto: CreateEventDto) {
    try {
      const res = await this.analyticsService.create(createEventDto);
      return res;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get('event-summary')
  @ApiResponse({ status: 200, description: 'Event summary retrieved' })
  async getSummary(@Query() query: EventSummaryDto) {
    try {
      const res = await this.analyticsService.getEventSummary(query);
      return res;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get('user-stats')
  @ApiResponse({ status: 200, description: 'User stats retrieved' })
  async getUserStats(@Query() query: UserStatsDto) {
    try {
      const res = this.analyticsService.getUserStats(query.userId);
      return res;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
