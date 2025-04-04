import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DiscordStrategy, GoogleStrategy, JwtStrategy } from './strategy';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [PassportModule.register({}), JwtModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, DiscordStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
