import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UsuarioTipo } from '../tipo/entities/tipo.entity';

@Entity({ schema: 'auth', name: 'usuario' })
export class Usuario {
  @PrimaryGeneratedColumn({ type: 'bigint' , primaryKeyConstraintName: 'pk_usuario'})
  idkey: number;

  @Column({ type: 'text', nullable:false})
  nome: string;

  @Column({ type: 'text', nullable:false})
  username: string;
  
  @Column({ type: 'text', nullable: false, unique: true})
  email: string;
  
  @Column({ type: 'text', nullable: false })
  senha: string;
  
  @Column({ type: 'text', nullable: false, unique: true })
  cpf: string;
  
  @Column({ type: 'date', name: 'data_nascimento', nullable: false })
  dataNascimento: Date;

  @Column({ type: 'timestamp',  name: 'data_cadastro', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  dataCadastro: Date;
  
  @ManyToOne(() => UsuarioTipo, usuarioTipo => usuarioTipo.usuarios)
  @JoinColumn({ name: 'idkey_tipo_usuario', referencedColumnName: 'idkey', foreignKeyConstraintName: 'fk_usuario_usuario_tipo'})
  tipo: UsuarioTipo;

  @Column({ type: 'bytea', nullable: true })
  imagem: Buffer;
}