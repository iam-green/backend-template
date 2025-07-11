import { Strategy } from 'passport-discord';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { IOAuthUser } from '../interface';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('DISCORD_OAUTH_CLIENT_ID', ''),
      clientSecret: configService.get<string>(
        'DISCORD_OAUTH_CLIENT_SECRET',
        '',
      ),
      callbackURL: configService.get<string>('DISCORD_OAUTH_REDIRECT_URL', ''),
      scope: configService.get<string>('DISCORD_OAUTH_SCOPE', '').split(''),
      passReqToCallback: true,
    });
  }

  validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: { id: string; email: string },
  ): IOAuthUser {
    const state = req.query.state
      ? Buffer.from(req.query.state as string, 'base64').toString('utf-8')
      : undefined;
    return {
      accessToken,
      refreshToken,
      id: profile.id,
      email: profile.email,
      state,
    };
  }
}
