import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './swagger.config';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

import * as bodyParser from 'body-parser';


async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: false,              // Remove propriedades que não estão definidas na DTO
    forbidNonWhitelisted: true,   // Lança um erro se propriedades desconhecidas forem enviadas
    transform: false,             // Converte os tipos dos dados automaticamente (por exemplo, string para número)
  }));

  setupSwagger(app);

  app.useGlobalFilters(new AllExceptionsFilter());

  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  await app.listen(3000);
}
bootstrap();
