import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
