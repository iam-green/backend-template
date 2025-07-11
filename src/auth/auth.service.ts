/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OAuthService } from 'src/oauth/oauth.service';
import { UserService } from 'src/user/user.service';
import { IOAuthUser } from './interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly oauthService: OAuthService,
    private readonly userService: UserService,
  ) {}

  generateAccessToken(id: string) {
    return this.jwtService.sign(
      { id },
      {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get<number>(
          'ACCESS_TOKEN_EXPIRES_IN',
          1000 * 60 * 60,
        ),
      },
    );
  }

  generateRefreshToken(id: string) {
    return this.jwtService.sign(
      { id },
      {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<number>(
          'REFRESH_TOKEN_EXPIRES_IN',
          1000 * 60 * 60 * 24 * 30,
        ),
      },
    );
  }

  verifyAccessToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      }) as unknown as { id: string };
    } catch (e) {
      return null;
    }
  }

  verifyRefreshToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      }) as unknown as { id: string };
    } catch (e) {
      return null;
    }
  }

  refreshAccessToken(refreshToken: string) {
    const decoded = this.verifyRefreshToken(refreshToken);
    if (!decoded) return null;
    return this.generateRefreshToken(decoded.id);
  }

  async googleLogin(data: IOAuthUser) {
    let user = await this.userService.getByEmail(data.email);
    if (!user) user = await this.userService.create({ email: data.email });
    const oauth = await this.oauthService.getByUser(user.id, 'google');
    if (!oauth)
      await this.oauthService.create({
        oauth_id: data.id,
        user_id: user.id,
        type: 'google',
        access_token: data.accessToken,
        refresh_token: data.refreshToken,
        token_expire: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      });
    else
      await this.oauthService.update(oauth.id, {
        access_token: data.accessToken,
        refresh_token: data.refreshToken,
        token_expire: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      });
    return user;
  }

  async discordLogin(data: IOAuthUser) {
    let user = await this.userService.getByEmail(data.email);
    if (!user) user = await this.userService.create({ email: data.email });
    const oauth = await this.oauthService.getByUser(user.id, 'discord');
    if (!oauth)
      await this.oauthService.create({
        oauth_id: data.id,
        user_id: user.id,
        type: 'discord',
        access_token: data.accessToken,
        refresh_token: data.refreshToken,
        token_expire: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      });
    else
      await this.oauthService.update(oauth.id, {
        access_token: data.accessToken,
        refresh_token: data.refreshToken,
        token_expire: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      });
    return user;
  }
}
