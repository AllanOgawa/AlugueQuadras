import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ schema: 'storage', name: 'imagem' })
export class Imagem {
  @PrimaryGeneratedColumn({ type: 'bigint', primaryKeyConstraintName: 'pk_file' })
  idkey: number;

  @Column({ type: 'text', name: 'path', nullable: false, unique: true })
  path: string;

  @CreateDateColumn({ type: 'timestamp', name: 'data_cadastro', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  dataCadastro: Date;
}
