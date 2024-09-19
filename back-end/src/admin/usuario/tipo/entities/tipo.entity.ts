import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Usuario } from '../../entities/usuario.entity';

@Entity({ schema: 'admin', name: 'usuario_tipo' })
export class UsuarioTipo {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  idkey: number;

  @Column({ type: 'text', nullable: true })
  descricao: string;  

  @OneToMany(() => Usuario, usuario => usuario.usuarioTipo)
  usuarios: Usuario[];
}