import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Estabelecimento } from '../../entities/estabelecimento.entity';
import { TipoEsporte } from '../tipo-esporte/entities/tipo-esporte.entity';
import { Imagem } from '@src/domains/storage/imagem/entities/imagem.entity';
import { Reserva } from '@src/domains/gestao/estabelecimento/quadra/reserva/entities/reserva.entity';

@Entity({ schema: 'gestao', name: 'quadra' })
export class Quadra {
  @PrimaryGeneratedColumn({ type: 'bigint', primaryKeyConstraintName: 'pk_quadra' })
  idkey: number;

  @Column({ type: 'text', nullable: false })
  nome: string;

  @Column({ type: 'text', nullable: true, name: 'informacoes_adicionais' })
  informacoesAdicionais: string;

  @Column({ type: 'numeric', nullable: false })
  valor: number;

  @Column({ type: 'numeric', nullable: false })
  largura: number;

  @Column({ type: 'numeric', nullable: false })
  comprimento: number;

  @Column({ type: 'boolean', nullable: false, default: false })
  coberta: boolean;

  @ManyToOne(() => Estabelecimento, estabelecimento => estabelecimento.quadras, { nullable: false })
  @JoinColumn({ name: 'idkey_estabelecimento' })
  estabelecimento: Estabelecimento;

  @ManyToMany(() => TipoEsporte, { eager: true, nullable: false, cascade: true })
  @JoinTable({
    name: 'rel_quadra_tipo_esporte',
    joinColumn: { name: 'idkey_quadra', referencedColumnName: 'idkey' },
    inverseJoinColumn: { name: 'idkey_tipo_esporte', referencedColumnName: 'idkey' }
  })
  tiposEsporte: TipoEsporte[];

  @ManyToMany(() => Imagem, { eager: true, nullable: true, cascade: true })
  @JoinTable({
    name: 'rel_quadra_imagem',
    joinColumn: { name: 'idkey_quadra', referencedColumnName: 'idkey' },
    inverseJoinColumn: { name: 'idkey_imagem', referencedColumnName: 'idkey' }
  })
  imagens: Imagem[];

  @OneToMany(() => Reserva, reserva => reserva.quadra, { eager: false, nullable: true, cascade: true })
  reservas: Reserva[];
}