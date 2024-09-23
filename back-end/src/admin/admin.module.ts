import { Module } from '@nestjs/common';
import { UsuarioModule } from './usuario/usuario.module';
import { UsuarioTipoModule } from './usuario/tipo/tipo.module';

@Module({
  imports: [
    UsuarioModule,
    UsuarioTipoModule,
  ],
  exports: [
    UsuarioModule
  ],
})
export class AdminModule {}
