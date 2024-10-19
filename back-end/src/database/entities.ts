import { Usuario }            from '@src/domains/auth/usuario/entities/usuario.entity';
import { Estabelecimento }    from '@src/domains/gestao/estabelecimento/entities/estabelecimento.entity';
import { Quadra }             from '@src/domains/gestao/estabelecimento/quadra/entities/quadra.entity';
import { TipoEsporte }        from '@src/domains/gestao/estabelecimento/quadra/tipo-esporte/entities/tipo-esporte.entity';
import { Imagem }             from '@src/domains/storage/imagem/entities/imagem.entity';
import { Endereco }           from '@src/domains/geral/endereco/entities/endereco.entity';

// Adicionar todas as entities aqui para ser lido pelo TypeORM

export const entities = [
  Usuario,
  Estabelecimento,
  Quadra,
  TipoEsporte,
  Imagem,
  Endereco
];
