import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterAppDto } from './dto/register-app.dto';
import { GetApiKeysDto } from './dto/get-api-keys.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            generateApiKey: jest.fn().mockResolvedValue({
              message: "API key generated successfully",
              app_name: "test-app",
              key: "test-key",
            }), // ✅ Updated mock
            registerApp: jest.fn().mockResolvedValue({
              message: "API key generated successfully",
              app_name: "test-app",
              key: "test-key",
            }), // ✅ Updated mock
            getUserApiKeys: jest.fn().mockResolvedValue([
              {
                id: 1,
                app_name: 'test-app',
                key: 'test-key',
                is_active: true,
              },
            ]),
            revokeApiKey: jest.fn().mockResolvedValue({ message: 'Revoked' }),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('API Key Management', () => {
    it('should register a new app and return an API key', async () => {
      const dto: RegisterAppDto = { app_name: 'test-app' };

      const result = await controller.registerApp({ user: { id: 1 } }, dto);

      expect(result).toEqual({
        message: "API key generated successfully",
        app_name: "test-app",
        key: "test-key",
      }); // ✅ Fixed expected output

      expect(authService.generateApiKey).toHaveBeenCalledWith(1, dto);
    });

    it('should return user API keys', async () => {
      const result = await controller.getApiKeys(
        { user: { id: 1 } },
        {} as GetApiKeysDto,
      );

      expect(result).toHaveLength(1);
      expect(result[0].app_name).toBe('test-app');
    });

    it('should revoke API key', async () => {
      const result = await controller.revokeApiKey(
        { user: { id: 1 } },
        { key_id: 1 },
      );

      expect(result).toEqual({ message: 'API key revoked successfully' });
      expect(authService.revokeApiKey).toHaveBeenCalledWith(1, 1);
    });
  });
});
