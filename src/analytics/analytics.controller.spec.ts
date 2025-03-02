import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { EventSummaryDto } from './dto/event-summary.dto';
import { UserStatsDto } from './dto/user-stats.dto';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;
  let analyticsService: AnalyticsService;

  const mockEvent = {
    event: 'login_form_cta_click',
    url: 'https://example.com/page',
    referrer: 'https://google.com',
    userId: 'user123',
    device: 'mobile',
    ipAddress: '192.168.1.1',
    timestamp: new Date('2024-02-20T12:34:56Z'),
    metadata: {
      browser: 'Chrome',
      os: 'Android',
      screenSize: '1080x1920',
    },
  };

  const mockSummary = {
    event: 'login_form_cta_click',
    count: 3400,
    uniqueUsers: 1200,
    deviceData: { mobile: 2200, desktop: 1200 },
  };

  const mockUserStats = {
    userId: 'user789',
    totalEvents: 150,
    deviceDetails: { browser: 'Chrome', os: 'Android' },
    ipAddress: '192.168.1.1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        {
          provide: AnalyticsService,
          useValue: {
            create: jest.fn().mockResolvedValue({ status: 'success' }),
            getEventSummary: jest.fn().mockResolvedValue(mockSummary),
            getUserStats: jest.fn().mockResolvedValue(mockUserStats),
          },
        },
      ],
    })
      .overrideGuard(ApiKeyGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
    analyticsService = module.get<AnalyticsService>(AnalyticsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /collect', () => {
    it('should create an analytics event', async () => {
      const dto: CreateEventDto = mockEvent;
      await expect(controller.create(dto)).resolves.toEqual({
        status: 'success',
      });
      expect(analyticsService.create).toHaveBeenCalledWith(dto);
    });

    it('should handle errors during event creation', async () => {
      const dto: CreateEventDto = mockEvent;
      jest
        .spyOn(analyticsService, 'create')
        .mockRejectedValueOnce(new Error('Test Error'));
      await expect(controller.create(dto)).rejects.toThrow('Test Error');
    });
  });

  describe('GET /event-summary', () => {
    it('should return event summary data', async () => {
      const query: EventSummaryDto = {
        event: 'login_form_cta_click',
        startDate: new Date('2025-02-15'),
        endDate: new Date('2025-03-15'),
      };

      const result = await controller.getSummary(query);
      expect(result).toEqual(mockSummary);
      expect(analyticsService.getEventSummary).toHaveBeenCalledWith(query);
    });

    it('should handle missing optional parameters', async () => {
      const query: EventSummaryDto = { event: 'login_form_cta_click' };
      await controller.getSummary(query);
      expect(analyticsService.getEventSummary).toHaveBeenCalledWith({
        event: 'login_form_cta_click',
        startDate: undefined,
        endDate: undefined,
        app_id: undefined,
      });
    });
  });

  describe('GET /user-stats', () => {
    it('should return user statistics', async () => {
      const query: UserStatsDto = { userId: 'user789' };
      await expect(controller.getUserStats(query)).resolves.toEqual(
        mockUserStats,
      );
      expect(analyticsService.getUserStats).toHaveBeenCalledWith('user789');
    });

    it('should handle invalid user IDs', async () => {
      const query: UserStatsDto = { userId: 'invalid-user' };
      jest
        .spyOn(analyticsService, 'getUserStats')
        .mockRejectedValueOnce(new Error('User not found'));
      await expect(controller.getUserStats(query)).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('Guards', () => {
    it('should have ApiKeyGuard applied', () => {
      const guards = Reflect.getMetadata('__guards__', AnalyticsController);
      expect(guards[0]).toBe(ApiKeyGuard);
    });
  });
});
