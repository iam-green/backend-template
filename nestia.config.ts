import { INestiaConfig } from '@nestia/sdk';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';

const NESTIA_CONFIG: INestiaConfig = {
  input: async () => {
    const app = await NestFactory.create(AppModule);
    return app;
  },
  swagger: {
    openapi: '3.1',
    output: 'dist/swagger.json',
    security: { bearer: { type: 'http', scheme: 'bearer' } },
    servers: [{ url: 'http://localhost:3000', description: 'Local Server' }],
    beautify: true,
  },
};
export default NESTIA_CONFIG;
