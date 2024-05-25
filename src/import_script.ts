/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ImportService } from './import.service';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const importService = app.get(ImportService);
  await importService.importWords();
  await app.close();
}

bootstrap();
