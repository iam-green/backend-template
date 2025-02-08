import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ExampleModule } from './example/example.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    UserModule,
    AuthModule,
    ExampleModule,
  ],
})
export class AppModule {}
