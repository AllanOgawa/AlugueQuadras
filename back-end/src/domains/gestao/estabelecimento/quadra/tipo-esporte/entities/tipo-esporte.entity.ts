import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'gestao', name: 'tipo_esporte' })
export class TipoEsporte {
  @PrimaryGeneratedColumn({ type: 'bigint', primaryKeyConstraintName: 'pk_tipo_esporte' })
  idkey: number;

  @Column({ type: 'text', unique: true, nullable: false })
  descricao: string; // Ex: Futebol, Basquete, Vôlei, etc.
}
