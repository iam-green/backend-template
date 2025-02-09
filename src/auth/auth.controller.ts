import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { IGoogleUser } from './interface/google-user.interface';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('google/callback')
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

    res.status(200).json({ ...user, accessToken });
  }
}
