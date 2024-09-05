import { Module } from '@nestjs/common';
import { UsuarioModule } from './usuario/usuario.module';
import { TipoUsuarioModule } from './tipo-usuario/tipo-usuario.module';

@Module({
  imports: [
    UsuarioModule,
    TipoUsuarioModule,
  ],
  exports: [
    UsuarioModule
  ],
})
export class AdminModule {}
