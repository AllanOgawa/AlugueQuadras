import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './swagger.config';


async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: false,              // Remove propriedades que não estão definidas na DTO
    forbidNonWhitelisted: true,   // Lança um erro se propriedades desconhecidas forem enviadas
    transform: false,             // Converte os tipos dos dados automaticamente (por exemplo, string para número)
  }));

  setupSwagger(app);

  await app.listen(3000);
}
bootstrap();
