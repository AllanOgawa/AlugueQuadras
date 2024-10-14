import { UsuarioTipo } from '@src/auth/usuario/tipo/entities/tipo.entity';
import { Usuario } from '@src/auth/usuario/entities/usuario.entity';
import { Estabelecimento } from '@src/domains/gestao/estabelecimento/entities/estabelecimento.entity';

// Adicionar todas as entities aqui para ser lido pelo TypeORM

export const entities = [
  Usuario,
  UsuarioTipo,
  Estabelecimento
];
