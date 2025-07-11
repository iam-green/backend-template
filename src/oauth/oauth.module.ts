import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { OAuthService } from './oauth.service';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [OAuthService],
  exports: [OAuthService],
})
export class OAuthModule {}
