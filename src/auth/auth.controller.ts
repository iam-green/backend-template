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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDto } from 'src/user/dto/user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Auth',
    description: '현재 로그인 되어 있는 계정 확인',
  })
  @UseGuards(AuthGuard('jwt'))
  auth(@Req() req: Request & { user: UserDto }) {
    return req.user;
  }

  @Get('google')
  @ApiOperation({
    summary: 'Google OAuth',
    description: 'Google OAuth를 사용하여 로그인',
  })
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('google/callback')
  @ApiOperation({
    summary: 'Google OAuth Callback',
    description: 'Google OAuth Callback 데이터 받기',
  })
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

  @Get('discord')
  @ApiOperation({
    summary: 'Discord OAuth',
    description: 'Discord OAuth를 사용하여 로그인',
  })
  @UseGuards(AuthGuard('discord'))
  discordAuth() {}

  @Get('discord/callback')
  @ApiOperation({
    summary: 'Discord OAuth Callback',
    description: 'Discord OAuth Callback 데이터 받기',
  })
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

  @Get('refresh')
  @ApiOperation({
    summary: 'Refresh Token',
    description: 'Access Token과 Refresh Token 재생성',
  })
  refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken: string | null = req.cookies.token;
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
