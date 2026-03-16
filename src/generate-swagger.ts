/* eslint-disable @typescript-eslint/no-floating-promises */
import * as fs from 'fs';

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function generateSwagger() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API - IT Asset Tracker')
    .setVersion('0.0.1')
    .addTag('api')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  fs.writeFileSync('./swagger.json', JSON.stringify(document, null, 2));
  await app.close();
  console.log('Especificación OpenAPI generada en ./swagger.json');
}

generateSwagger();
