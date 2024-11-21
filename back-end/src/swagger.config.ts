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
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .addTag('Autenticação', 'Endpoints relacionados ao gerenciamento de autenticação e usuários.')
    .addTag('Estabelecimento', 'Endpoints para a gestão dos estabelecimentos.')
    .addTag('Quadra', 'Endpoints que lidam com operações de CRUD de quadras esportivas.')
    .addTag('Storage', 'Endpoints para a gestão do bucket, controla o envio de imagens.')
    .addTag('Tipo Esporte', 'Endpoints que lidam com operações de CRUD de tipos de esportes.')
    .addTag('Acomodação', 'Endpoints que lidam com operações de CRUD de acomodaçoes do estabelecimento.')
    .addTag('Horário de Funcionamento', 'Endpoints que lidam com operações de leitura de horários de funcionamento.')
    .addTag('Reserva', 'Endpoints que lidam com operações de CRUD de reservas das quadras.')
    .addTag('Health', 'Endpoints para testar a disponibilidade da aplicação.')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}
