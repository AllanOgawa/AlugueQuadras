import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UsuarioTipo } from '../tipo/entities/tipo.entity';

@Entity({ schema: 'admin', name: 'usuario' })
export class Usuario {
  @PrimaryGeneratedColumn({ type: 'bigint' , primaryKeyConstraintName: 'pk_usuario'})
  idkey: number;
  
  @Column({ type: 'int', nullable: false, default: 1 })
  idkey_tipo_usuario: number;

  @Column({ type: 'text', nullable: false, unique: true})
  email: string;
  
  @Column({ type: 'text', nullable: false })
  senha: string;
  
  @Column({ type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  data_cadastro: Date;

  @ManyToOne(() => UsuarioTipo, usuarioTipo => usuarioTipo.usuarios)
  @JoinColumn({ name: 'idkey_tipo_usuario', referencedColumnName: 'idkey', foreignKeyConstraintName: 'fk_usuario_usuario_tipo'})
  usuarioTipo: UsuarioTipo;
}