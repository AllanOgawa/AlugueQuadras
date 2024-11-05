import { Module } from '@nestjs/common';
import { AcomodacaoService } from './acomodacao.service';
import { AcomodacaoController } from './acomodacao.controller';
import { Acomodacao } from './entities/acomodacao.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Acomodacao])],
    controllers: [AcomodacaoController],
    providers: [AcomodacaoService],
    exports: [AcomodacaoService],
})
export class AcomodacaoModule {}
