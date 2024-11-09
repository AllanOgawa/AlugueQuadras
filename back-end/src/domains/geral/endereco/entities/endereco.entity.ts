import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from "typeorm";

import { Estabelecimento } from "@src/domains/gestao/estabelecimento/entities/estabelecimento.entity";

@Entity({ schema: 'geral', name: 'endereco' })
export class Endereco {

  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idkey' })
  idkey: number;

  @Column({ type: 'text', nullable: false })
  logradouro: string;

  @Column({ type: 'text', nullable: false })
  numero: string;

  @Column({ type: 'text', nullable: true })
  complemento?: string;

  @Column({ type: 'text', nullable: false })
  bairro: string;

  @Column({ type: 'text', nullable: false })
  cidade: string;

  @Column({ type: 'text', nullable: false })
  estado: string;

  @Column({ type: 'text', nullable: false })
  cep: string;

  @Column({ type: 'text', nullable: true })
  latitude: string;

  @Column({ type: 'text', nullable: true })
  longitude: string;

  @CreateDateColumn({ type: 'timestamp', name: 'data_cadastro', default: () => 'CURRENT_TIMESTAMP' })
  dataCadastro: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'data_atualizacao' })
  dataAtualizacao: Date;

  // Relacionamento One-to-One com Estabelecimento
  @OneToOne(() => Estabelecimento, estabelecimento => estabelecimento.endereco)
  estabelecimento: Estabelecimento;
}
