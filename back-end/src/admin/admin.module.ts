import { Module } from '@nestjs/common';
import { UsuarioModule } from './usuario/usuario.module';


@Module({
  imports: [
    UsuarioModule
  ],
  exports: [
    UsuarioModule
  ],
})
export class AdminModule {}
