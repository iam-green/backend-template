import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import 'dotenv/config';
import { patchNestJsSwagger, ZodValidationPipe } from 'nestjs-zod';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(new ZodValidationPipe());
  if (process.env.NODE_ENV != 'production') {
    patchNestJsSwagger();
    const config = new DocumentBuilder()
      .setTitle('Backend Template')
      .setDescription('Backend Template')
      .setVersion('0.0.1')
      .addOAuth2()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
