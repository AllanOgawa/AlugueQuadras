import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity({ schema: 'admin', name: 'tipo_usuario' })
export class TipoUsuario {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  idkey: number;

  @Column({ type: 'text', nullable: true })  
  descricao: string;  

  @OneToMany(() => Usuario, usuario => usuario.tipoUsuario)
  usuarios: Usuario[];
}
