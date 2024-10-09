import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Estabelecimento } from '../../entities/estabelecimento.entity';
import { TipoEsporte } from './tipo-esporte.entity';

@Entity({ schema: 'gestao', name: 'quadra' })
export class Quadra {
  @PrimaryGeneratedColumn({ type: 'bigint' , primaryKeyConstraintName: 'pk_quadra'})
  idkey: number;

  @Column({ type: 'text', nullable:false})
  nome: string;

  @Column({ type: 'text', nullable: true , name: 'informacoes_adicionais'})
  informacoesAdicionais: string;

  @Column({ type: 'numeric', nullable: false })
  valor: number;

  @Column({ type: 'text', nullable: true })
  imagem: string;

  @ManyToOne(() => Estabelecimento, estabelecimento => estabelecimento.quadras, { nullable: false })
  @JoinColumn({ name: 'idkey_estabelecimento' })
  estabelecimento: Estabelecimento;

  @ManyToMany(() => TipoEsporte, { eager: true, nullable: false, cascade: true})  // eager: true para trazer os tipos de esporte junto com a quadra
  @JoinTable({
    name: 'rel_quadra_tipo_esporte', 
    joinColumn: { name: 'idkey_quadra', referencedColumnName: 'idkey' },
    inverseJoinColumn: { name: 'idkey_tipo_esporte', referencedColumnName: 'idkey' }
  })
  tiposEsporte: TipoEsporte[];
}