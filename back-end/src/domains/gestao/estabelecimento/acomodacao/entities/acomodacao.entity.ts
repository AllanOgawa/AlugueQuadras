import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity({ schema: 'gestao', name: 'acomodacao' })
export class Acomodacao {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    primaryKeyConstraintName: 'pk_acomodacao',
  })
  idkey: number;

  @Column({ type: 'text', unique: true, nullable: false })
  descricao: string;

  @Column({ type: 'text', nullable: true })
  icone: string;

  @ManyToMany(() => Acomodacao, { eager: true, nullable: true, cascade: true })
  @JoinTable({
    name: 'rel_estabelecimento_acomodacao',
    joinColumn: {
      name: 'idkey_estabelecimento',
      referencedColumnName: 'idkey',
    },
    inverseJoinColumn: { name: 'id_acomodacao', referencedColumnName: 'id' },
  })
  acomodacoes: Acomodacao[];
}
