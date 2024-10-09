import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('AlugueQuadras API')
    .setDescription(
      'Esta API fornece um conjunto de operações para gerenciar quadras esportivas, permitindo que usuários façam reservas, visualizem disponibilidade e interajam com os donos das quadras. ' +
      '\n\n O projeto "Alugue Quadras" foi desenvolvido para facilitar o acesso a quadras esportivas, promovendo uma comunidade ativa e engajada em atividades físicas. ' +
      '\n\n A API foi construída utilizando o framework NestJS, visando fornecer uma interface robusta e bem documentada para integração com aplicativos e outros sistemas.'
    )
    .setVersion('1.0')
    .addTag('Autenticação', 'Endpoints relacionados ao gerenciamento de autenticação e usuários.')
    .addTag('Usuário', 'Endpoints para a gestão de perfis e interações dos usuários.')  
    .addTag('Estabelecimento', 'Endpoints para a gestão dos estabelecimentos.')
    .addTag('Quadra', 'Endpoints que lidam com operações de CRUD de quadras esportivas.')
    // .addTag('Reservas', 'Endpoints para a gestão de reservas de quadras.')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}
