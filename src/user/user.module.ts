import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UserService } from './user.service';
import { OAuthModule } from 'src/oauth/oauth.module';

@Module({
  imports: [DatabaseModule, OAuthModule],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
