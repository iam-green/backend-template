import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ExampleModule } from './example/example.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    ExampleModule,
  ],
})
export class AppModule {}
