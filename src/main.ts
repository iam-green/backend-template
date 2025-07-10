import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NestiaSwaggerComposer } from '@nestia/sdk';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (!process.env.FRONTEND_URL) app.enableCors();
  else
    app.enableCors({
      origin: process.env.FRONTEND_URL.split(','),
      credentials: true,
    });
  app.use(cookieParser());
  if (process.env.NODE_ENV != 'production') {
    const document = await NestiaSwaggerComposer.document(app, {
      security: { bearer: { type: 'http', scheme: 'bearer' } },
      servers: (process.env.SWAGGER_SERVERS ?? '').split(',').map((data) => ({
        url: data.split(';')[0],
        description: data.split(';')[1],
      })),
    });
    SwaggerModule.setup('docs', app, document as OpenAPIObject);
  }
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
