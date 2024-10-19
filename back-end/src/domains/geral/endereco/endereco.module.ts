import { Module } from '@nestjs/common';
import { EnderecoService } from './endereco.service';
import { Endereco } from './entities/endereco.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Endereco])],
  providers: [EnderecoService],
  exports: [EnderecoService],
})
export class EnderecoModule {}
