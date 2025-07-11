/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { IOAuthUser, OAuthState } from './interface';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { TypedQuery, TypedRoute } from '@nestia/core';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from 'src/user/dto';
import { AccessTokenDto, LogoutDto, StateDto } from './dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Get User Info
   *
   * @description Get user info using jwt access token
   * @security bearer
   */
  @TypedRoute.Get()
  @UseGuards(AuthGuard('jwt'))
  auth(@Req() req: Request & { user: UserDto }): UserDto {
    return req.user;
  }

  /**
   * Google OAuth
   *
   * @description Redirect to Google OAuth
   */
  @TypedRoute.Get('google')
  googleAuth(@Res() res: Response, @TypedQuery() state: StateDto) {
    const clientId = this.configService.get<string>(
      'GOOGLE_OAUTH_CLIENT_ID',
      '',
    );
    const redirectUri = this.configService.get<string>(
      'GOOGLE_OAUTH_REDIRECT_URL',
      '',
    );
    const scope = this.configService.get<string>('GOOGLE_OAUTH_SCOPE', '');

    res.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&client_id=${clientId}&access_type=offline&prompt=consent&service=lso&o2v=2&flowName=GeneralOAuthFlow&state=${state.state ?? ''}`,
    );
  }

  /**
   * Google OAuth Callback

   * @description Google OAuth Callback
   */
  @TypedRoute.Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(
    @Req()
    req: Request & { user: IOAuthUser },
    @Res() res: Response,
  ): Promise<AccessTokenDto | void> {
    const user = await this.authService.googleLogin(req.user);

    const refreshToken = this.authService.generateRefreshToken(user.id);

    res.cookie('token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV == 'production',
      maxAge: this.configService.get<number>(
        'REFRESH_TOKEN_EXPIRES_IN',
        1000 * 60 * 60 * 24 * 30,
      ),
    });

    if (req.user.state)
      try {
        const state = JSON.parse(req.user.state) as OAuthState;
        if (state.redirectUrl) return res.redirect(state.redirectUrl);
      } catch (e) {
        /* empty */
      }

    const accessToken = this.authService.generateAccessToken(user.id);
    res.status(200).json({ accessToken });
    return { accessToken };
  }

  /**
   * Discord OAuth
   *
   * @description Redirect to Discord OAuth
   */
  @TypedRoute.Get('discord')
  discordAuth(@Res() res: Response, @TypedQuery() state: StateDto) {
    // https://discord.com/oauth2/authorize?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fdiscord%2Fcallback&scope=identify%20email&client_id=1335556138346745879
    const clientId = this.configService.get<string>(
      'DISCORD_OAUTH_CLIENT_ID',
      '',
    );
    const redirectUri = this.configService.get<string>(
      'DISCORD_OAUTH_REDIRECT_URL',
      '',
    );
    const scope = this.configService.get<string>('DISCORD_OAUTH_SCOPE', '');

    res.redirect(
      `https://discord.com/oauth2/authorize?response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&client_id=${clientId}&access_type=offline&prompt=consent&state=${state.state ?? ''}`,
    );
  }

  /**
   * Discord OAuth Callback
   *
   * @description Discord OAuth Callback
   */
  @TypedRoute.Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  async discordAuthCallback(
    @Req() req: Request & { user: IOAuthUser },
    @Res() res: Response,
  ): Promise<AccessTokenDto | void> {
    const user = await this.authService.discordLogin(req.user);

    const refreshToken = this.authService.generateRefreshToken(user.id);

    res.cookie('token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV == 'production',
      maxAge: this.configService.get<number>(
        'REFRESH_TOKEN_EXPIRES_IN',
        1000 * 60 * 60 * 24 * 30,
      ),
    });

    if (req.user.state)
      try {
        const state = JSON.parse(req.user.state) as OAuthState;
        if (state.redirectUrl) return res.redirect(state.redirectUrl);
      } catch (e) {
        /* empty */
      }

    const accessToken = this.authService.generateAccessToken(user.id);
    res.status(200).json({ accessToken });
    return { accessToken };
  }

  /**
   * Refresh Token
   *
   * @description Refresh access token using refresh token
   */
  @TypedRoute.Get('token')
  refresh(
    @Req() req: Request & { cookies: { token?: string } },
    @Res() res: Response,
  ): AccessTokenDto {
    const refreshToken: string | undefined = req.cookies.token;
    if (!refreshToken) throw new UnauthorizedException();

    const token = this.authService.refreshAccessToken(refreshToken);
    if (!token) throw new UnauthorizedException();

    res.status(200).json({ accessToken: token });
    return { accessToken: token };
  }

  /**
   * Logout
   *
   * @description Logout user by clearing the refresh token cookie
   */
  @TypedRoute.Get('logout')
  logout(@Res() res: Response, @TypedQuery() query: LogoutDto): void {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV == 'production',
    });
    if (query.redirectUrl) res.redirect(query.redirectUrl);
    else res.status(200).json({ message: 'Logged out successfully' });
  }
}
