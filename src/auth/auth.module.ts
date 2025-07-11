import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DiscordStrategy, GoogleStrategy, JwtStrategy } from './strategy';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { OAuthModule } from 'src/oauth/oauth.module';

@Module({
  imports: [PassportModule.register({}), JwtModule, OAuthModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, DiscordStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
