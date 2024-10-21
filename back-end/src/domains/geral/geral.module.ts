import { Module } from '@nestjs/common';
import { EnderecoModule } from './endereco/endereco.module';

@Module({
  imports: [
    EnderecoModule
  ]
})
export class GeralModule { }