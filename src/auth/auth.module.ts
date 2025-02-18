import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategy/google.strategy';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { DiscordStrategy } from './strategy/discord.strategy';

@Module({
  imports: [PassportModule.register({}), JwtModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, DiscordStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
