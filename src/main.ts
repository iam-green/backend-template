import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NestiaSwaggerComposer } from '@nestia/sdk';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cookieParser());
  if (process.env.NODE_ENV != 'production') {
    const document = await NestiaSwaggerComposer.document(app, {
      security: { bearer: { type: 'http', scheme: 'bearer' } },
      servers: [{ url: 'http://localhost:3000', description: 'Local Server' }],
    });
    SwaggerModule.setup('docs', app, document as OpenAPIObject);
  }
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
