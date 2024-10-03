import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Estabelecimento } from '../../entities/estabelecimento.entity';

@Entity({ schema: 'gestao', name: 'quadra' })
export class Quadra {
  @PrimaryGeneratedColumn({ type: 'bigint' , primaryKeyConstraintName: 'pk_quadra'})
  idkey: number;

  @Column({ type: 'text', nullable:false})
  nome: string;

  @Column({ type: 'text', nullable: true })
  informacoesAdicionais: string;

  @Column({ type: 'numeric', nullable: false })
  valor: number;

  @Column({ type: 'bytea', nullable: true })
  imagem: Buffer;
  
  //enum tipoEsporte

  @ManyToOne(() => Estabelecimento, estabelecimento => estabelecimento.quadras, { nullable: false })
  @JoinColumn({ name: 'idkey_estabelecimento' })
  estabelecimento: Estabelecimento;
}