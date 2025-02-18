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
import { IGoogleUser } from './interface/google-user.interface';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('google')
  @ApiOperation({ summary: 'Google Auth', description: 'Google Auth' })
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('google/callback')
  @ApiOperation({
    summary: 'Google Auth Callback',
    description: 'Google Auth Callback',
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

  @Get('refresh')
  @ApiOperation({ summary: 'Refresh Token', description: 'Refresh Token' })
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
