import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estabelecimento } from './entities/estabelecimento.entity';
import { EstabelecimentoService } from './estabelecimento.service';
import { EstabelecimentoController } from './estabelecimento.controller';
import { QuadraModule } from './quadra/quadra.module';
import { UsuarioModule } from '@src/domains/auth/usuario/usuario.module';
import { AcomodacaoModule } from './acomodacao/acomodacao.module';
import { ImagemModule } from '@src/domains/storage/imagem/imagem.module';
import { EnderecoModule } from '@src/domains/geral/endereco/endereco.module';
import { HorariofuncionamentoModule } from './horariofuncionamento/horariofuncionamento.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Estabelecimento]),
        QuadraModule,
        UsuarioModule,
        AcomodacaoModule,
        ImagemModule,
        EnderecoModule,
        HorariofuncionamentoModule,
    ],
    controllers: [EstabelecimentoController],
    providers: [EstabelecimentoService],
    exports: [EstabelecimentoService],
})
export class EstabelecimentoModule {}