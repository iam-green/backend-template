import { INestiaConfig } from '@nestia/sdk';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import 'dotenv/config';

const NESTIA_CONFIG: INestiaConfig = {
  input: async () => {
    const app = await NestFactory.create(AppModule);
    return app;
  },
  output: 'packages/sdk/src',
  distribute: 'packages/sdk',
  clone: true,
  swagger: {
    openapi: '3.1',
    output: 'dist/swagger.json',
    security: { bearer: { type: 'http', scheme: 'bearer' } },
    servers: (process.env.SWAGGER_SERVERS ?? '').split(',').map((data) => ({
      url: data.split(';')[0],
      description: data.split(';')[1],
    })),
    beautify: true,
  },
};
export default NESTIA_CONFIG;
