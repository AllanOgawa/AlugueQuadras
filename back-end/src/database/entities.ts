import { Usuario }            from '@domains/auth/usuario/entities/usuario.entity';
import { Estabelecimento }    from '@domains/gestao/estabelecimento/entities/estabelecimento.entity';
import { Quadra }             from '@domains/gestao/estabelecimento/quadra/entities/quadra.entity';
import { TipoEsporte }        from '@src/domains/gestao/estabelecimento/quadra/tipo-esporte/entities/tipo-esporte.entity';
import { Imagem }             from '@domains/storage/entities/imagem.entity';

// Adicionar todas as entities aqui para ser lido pelo TypeORM

export const entities = [
  Usuario,
  Estabelecimento,
  Quadra,
  TipoEsporte,
  Imagem
];
