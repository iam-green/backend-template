import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DiscordStrategy, GoogleStrategy, JwtStrategy } from './strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PassportModule.register({}), JwtModule],
  controllers: [],
  providers: [GoogleStrategy, DiscordStrategy, JwtStrategy],
  exports: [GoogleStrategy, DiscordStrategy, JwtStrategy],
})
export class AuthModule {}
