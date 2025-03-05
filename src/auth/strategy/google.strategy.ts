import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_OAUTH_CLIENT_ID', ''),
      clientSecret: configService.get<string>('GOOGLE_OAUTH_CLIENT_SECRET', ''),
      callbackURL: configService.get<string>('GOOGLE_OAUTH_REDIRECT_URL', ''),
      scope: ['profile', 'email'],
    });
  }

  validate(accessToken: string, _: string, profile: Profile) {
    return { accessToken, id: profile.id, email: profile.emails![0].value };
  }
}
