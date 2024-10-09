import { UsuarioTipo } from '@src/auth/usuario/tipo/entities/tipo.entity';
import { Usuario } from '@src/auth/usuario/entities/usuario.entity';
import { Estabelecimento } from '@src/domains/gestao/estabelecimento/entities/estabelecimento.entity';
import { Quadra } from '@src/domains/gestao/estabelecimento/quadra/entities/quadra.entity';
import { TipoEsporte } from '@src/domains/gestao/estabelecimento/quadra/entities/tipo-esporte.entity';

// Adicionar todas as entities aqui para ser lido pelo TypeORM

export const entities = [
  Usuario,
  UsuarioTipo,
  Estabelecimento,
  Quadra,
  TipoEsporte
];
