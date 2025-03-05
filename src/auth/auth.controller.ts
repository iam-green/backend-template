import {
  Controller,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { IDiscordUser, IGoogleUser } from './interface';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TypedRoute } from '@nestia/core';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from 'src/user/dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @TypedRoute.Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  auth(@Req() req: Request & { user: UserDto }) {
    return req.user;
  }

  @TypedRoute.Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @TypedRoute.Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(
    @Req()
    req: Request & { user: IGoogleUser },
    @Res() res: Response,
  ) {
    const user = await this.authService.googleLogin(
      req.user.id,
      req.user.email,
    );

    const { accessToken, refreshToken } = this.authService.generateToken({
      id: user.id,
    });

    res.cookie('token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV == 'production',
      maxAge: this.configService.get<number>(
        'REFRESH_TOKEN_EXPIRES_IN',
        1000 * 60 * 60 * 24 * 30,
      ),
    });

    res.status(200).json({ accessToken });
  }

  @TypedRoute.Get('discord')
  @UseGuards(AuthGuard('discord'))
  discordAuth() {}

  @TypedRoute.Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  async discordAuthCallback(
    @Req() req: Request & { user: IDiscordUser },
    @Res() res: Response,
  ) {
    const user = await this.authService.discordLogin(
      req.user.id,
      req.user.email,
    );

    const { accessToken, refreshToken } = this.authService.generateToken({
      id: user.id,
    });

    res.cookie('token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV == 'production',
      maxAge: this.configService.get<number>(
        'REFRESH_TOKEN_EXPIRES_IN',
        1000 * 60 * 60 * 24 * 30,
      ),
    });

    res.status(200).json({ accessToken });
  }

  @TypedRoute.Get('refresh')
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
