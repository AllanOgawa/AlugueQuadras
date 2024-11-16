import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Quadra } from '@src/domains/gestao/estabelecimento/quadra/entities/quadra.entity';
import { Usuario } from '@src/domains/auth/usuario/entities/usuario.entity';

@Entity({ schema: 'gestao', name: 'reserva' })
export class Reserva {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    primaryKeyConstraintName: 'pk_reserva',
  })
  idkey: number;

  @Column({ name: 'data_inicio', type: 'timestamptz', nullable: false })
  dataInicio: Date;

  @Column({ name: 'data_fim', type: 'timestamptz', nullable: false })
  dataFim: Date;

  @ManyToOne(() => Quadra, (quadra) => quadra.reservas, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'idkey_quadra' })
  quadra: Quadra;

  @ManyToOne(() => Usuario, (usuario) => usuario.reservas, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'idkey_usuario' }) // Nome da coluna de junção para Usuario
  usuario: Usuario;

  @Column({ type: 'boolean', default: false })
  cancelada: boolean;
}
