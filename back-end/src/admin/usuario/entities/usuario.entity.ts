import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TipoUsuario } from '../../tipo-usuario/entities/tipo-usuario.entity';

@Entity({ schema: 'admin', name: 'usuario' })
export class Usuario {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  idkey: number;
  
  @Column({ type: 'int', nullable: false, default: 1 })
  idkey_tipo_usuario: number;

  @Column({ type: 'text', nullable: false, unique: true})
  email: string;
  
  @Column({ type: 'text', nullable: false })
  senha: string;
  
  @Column({ type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  data_cadastro: Date;

  @ManyToOne(() => TipoUsuario, tipoUsuario => tipoUsuario.usuarios)
  @JoinColumn({ name: 'idkey_tipo_usuario', referencedColumnName: 'idkey', foreignKeyConstraintName: 'fk_usuario_tipo_usuario'})
  tipoUsuario: TipoUsuario;
}