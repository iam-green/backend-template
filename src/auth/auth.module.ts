import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DiscordStrategy, GoogleStrategy, JwtStrategy } from './strategy';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [PassportModule.register({}), JwtModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, DiscordStrategy, JwtStrategy],
  exports: [AuthService, GoogleStrategy, DiscordStrategy, JwtStrategy],
})
export class AuthModule {}
