import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Request } from 'express';
import { IOAuthUser } from '../interface';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_OAUTH_CLIENT_ID', ''),
      clientSecret: configService.get<string>('GOOGLE_OAUTH_CLIENT_SECRET', ''),
      callbackURL: configService.get<string>('GOOGLE_OAUTH_REDIRECT_URL', ''),
      scope: configService.get<string>('GOOGLE_OAUTH_SCOPE', '').split(''),
      passReqToCallback: true,
    });
  }

  validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): IOAuthUser {
    const state = req.query.state
      ? Buffer.from(req.query.state as string, 'base64').toString('utf-8')
      : undefined;
    return {
      accessToken,
      refreshToken,
      id: profile.id,
      email: profile.emails![0].value,
      state,
    };
  }
}
