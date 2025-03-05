import { Strategy } from 'passport-discord';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy) {
  constructor(readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('DISCORD_OAUTH_CLIENT_ID', ''),
      clientSecret: configService.get<string>(
        'DISCORD_OAUTH_CLIENT_SECRET',
        '',
      ),
      callbackURL: configService.get<string>('DISCORD_OAUTH_REDIRECT_URL', ''),
      scope: ['identify', 'email'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: { id: string; email: string },
  ) {
    return { accessToken, refreshToken, id: profile.id, email: profile.email };
  }
}
