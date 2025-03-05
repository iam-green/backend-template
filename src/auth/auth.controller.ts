import {
  Controller,
  Get,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { IDiscordUser, IGoogleUser } from './interface';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { DiscordStrategy, GoogleStrategy } from './strategy';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  auth(@Req() req: Request) {
    return req.user;
  }

  @Get('google')
  @UseGuards(GoogleStrategy)
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleStrategy)
  googleAuthCallback(
    @Req()
    req: Request & { user: IGoogleUser },
  ) {
    return req.user;
  }

  @Get('discord')
  @UseGuards(DiscordStrategy)
  discordAuth() {}

  @Get('discord/callback')
  @UseGuards(DiscordStrategy)
  discordAuthCallback(@Req() req: Request & { user: IDiscordUser }) {
    return req.user;
  }

  @Get('refresh')
  refresh(
    @Req() req: Request & { cookies: { token?: string } },
    @Res() res: Response,
  ) {
    const refreshToken: string | undefined = req.cookies.token;
    if (!refreshToken) throw new UnauthorizedException();

    const token = this.authService.refreshAccessToken(refreshToken);
    if (!token) throw new UnauthorizedException();

    res.cookie('token', token.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV == 'production',
      maxAge: this.configService.get<number>(
        'REFRESH_TOKEN_EXPIRES_IN',
        1000 * 60 * 60 * 24 * 30,
      ),
    });

    res.status(200).json({ accessToken: token.accessToken });
  }
}
