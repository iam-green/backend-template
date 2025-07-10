/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
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

  async googleLogin(google_id: string, email: string) {
    let user = await this.userService.getByEmail(email);
    if (user && user.google_id != google_id)
      user = await this.userService.update(user.id, { google_id });
    return (
      user ?? this.userService.create({ google_id, discord_id: null, email })
    );
  }

  async discordLogin(discord_id: string, email: string) {
    let user = await this.userService.getByEmail(email);
    if (user && user.discord_id != discord_id)
      user = await this.userService.update(user.id, { discord_id });
    return (
      user ?? this.userService.create({ google_id: null, discord_id, email })
    );
  }
}
