import { TipoUsuario } from 'src/admin/tipo-usuario/entities/tipo-usuario.entity';
import { Usuario } from '../admin/usuario/entities/usuario.entity';

// Adicionar todas as entities aqui para ser lido pelo TypeORM

export const entities = [
  Usuario,
  TipoUsuario
];
