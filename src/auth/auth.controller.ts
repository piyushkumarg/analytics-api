import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterAppDto } from './dto/register-app.dto';
import { RevokeKeyDto } from './dto/revoke-key.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetApiKeysDto } from './dto/get-api-keys.dto';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth flow' })
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleAuthRedirect(@Req() req) {
    try {
      const user = await this.authService.findOrCreateUser(req.user);
      return { access_token: this.authService.generateJwtToken(user.id) };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Post('register')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register new application' })
  async registerApp(@Req() req, @Body() dto: RegisterAppDto) {
    try {
      const apiKey = await this.authService.generateApiKey(req.user.id, dto);

      console.log('res', apiKey);

      return {
        message: 'API key generated successfully',
        key: apiKey.key,
        app_name: apiKey.app_name,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get('api-key')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get API keys for user' })
  @ApiQuery({ type: GetApiKeysDto })
  async getApiKeys(@Req() req, @Query() query: GetApiKeysDto) {
    // For regular users, use their own ID
    try {
      const userId = req.user.id;

      const res = await this.authService.getUserApiKeys({
        user_id: userId,
        app_name: query.app_name,
        is_active: query.is_active,
      });

      if (!res || res.length === 0) {
        return { message: 'No API keys found' };
      }

      return res;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Post('revoke')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke an API key' })
  async revokeApiKey(@Req() req, @Body() dto: RevokeKeyDto) {
    try {
      await this.authService.revokeApiKey(req.user.id, dto.key_id);
      return { message: 'API key revoked successfully' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
