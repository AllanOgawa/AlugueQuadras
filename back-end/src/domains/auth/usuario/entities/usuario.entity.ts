import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';

import { UsuarioTipoEnum } from '../enums/usuario-tipo.enum';
import { Estabelecimento } from '@domains/gestao/estabelecimento/entities/estabelecimento.entity';
import { Imagem } from '@src/domains/storage/imagem/entities/imagem.entity';
import { Reserva } from '@src/domains/gestao/estabelecimento/quadra/reserva/entities/reserva.entity';

@Entity({ schema: 'auth', name: 'usuario' })
export class Usuario {
  @PrimaryGeneratedColumn({ type: 'bigint', primaryKeyConstraintName: 'pk_usuario' })
  idkey: number;

  @Column({ type: 'text', nullable: false })
  nome: string;

  @Column({ type: 'text', nullable: false, unique: true })
  username: string;

  @Column({ type: 'text', nullable: false, unique: true })
  email: string;

  @Column({ type: 'text', nullable: false })
  senha: string;

  @Column({ type: 'text', nullable: false, unique: true })
  cpf: string;

  @Column({ type: 'date', name: 'data_nascimento', nullable: false })
  dataNascimento: Date;

  @Column({ type: 'timestamp', name: 'data_cadastro', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  dataCadastro: Date;

  @Column({
    type: 'enum',
    enum: UsuarioTipoEnum,
    default: UsuarioTipoEnum.USER,
    nullable: false,
  })
  tipo: UsuarioTipoEnum;

  @OneToMany(() => Estabelecimento, estabelecimento => estabelecimento.usuario)
  estabelecimentos: Estabelecimento[];

  @ManyToMany(() => Imagem, { eager: true, nullable: true, cascade: true })
  @JoinTable({
    name: 'rel_usuario_imagem',
    joinColumn: { name: 'idkey_usuario', referencedColumnName: 'idkey' },
    inverseJoinColumn: { name: 'idkey_imagem', referencedColumnName: 'idkey' }
  })
  imagens: Imagem[];

  @OneToMany(() => Reserva, reserva => reserva.usuario)
  reservas: Reserva[];
}