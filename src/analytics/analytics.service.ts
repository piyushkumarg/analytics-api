import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { AnalyticsEvent } from '../entity/analytics-event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { EventSummaryDto } from './dto/event-summary.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(AnalyticsEvent)
    private readonly repository: typeof AnalyticsEvent,
  ) {}

  private getDeviceDetails(events: AnalyticsEvent[]) {
    const latest = events[0];
    return {
      browser: latest?.metadata?.browser || 'unknown',
      os: latest?.metadata?.os || 'unknown',
    };
  }

  private aggregateDeviceData(events: AnalyticsEvent[]) {
    return events.reduce((acc, event) => {
      acc[event.device] = (acc[event.device] || 0) + 1;
      return acc;
    }, {});
  }

  async create(dto: CreateEventDto) {
    return this.repository.create({
      ...dto,
      timestamp: new Date(dto.timestamp),
      appId: 'xyz123', // Should come from authenticated context
    });
  }

  async getEventSummary(dto: EventSummaryDto) {
    const where: any = { event: dto.event };

    if (dto.startDate && dto.endDate) {
      where.timestamp = {
        [Op.between]: [new Date(dto.startDate), new Date(dto.endDate)],
      };
    }

    if (dto.appId) {
      where.appId = dto.appId;
    }

    const events = await this.repository.findAll({ where });

    console.log('events', JSON.stringify(events, null, 2));

    const parsedEvents = JSON.parse(JSON.stringify(events));

    const result = {
      event: dto.event,
      count: events.length,
      uniqueUsers: new Set(events.map((e) => e.userId)).size,
      deviceData: this.aggregateDeviceData(parsedEvents),
    };

    return result;
  }

  async getUserStats(userId: string) {
    const events = await this.repository.findAll({
      where: { userId },
      order: [['timestamp', 'DESC']],
    });

    const parsedEvents = JSON.parse(JSON.stringify(events));

    const result = {
      userId,
      totalEvents: events.length,
      deviceDetails: this.getDeviceDetails(parsedEvents),
      ipAddress: events[0]?.ipAddress,
    };

    return result;
  }
}
