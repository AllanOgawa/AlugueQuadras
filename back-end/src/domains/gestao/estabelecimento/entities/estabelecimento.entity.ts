import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,  } from "typeorm";

@Entity({schema:'gestao', name:'estabelecimento'})
export class Estabelecimento {

@PrimaryGeneratedColumn({type: 'bigint' , primaryKeyConstraintName:'pk_estabelecimento'})
idkey:number;

@Column({type: 'text', nullable: false, unique: true})
cnpj: string;

@Column({type: 'text', nullable: false})
razao_social: string;

@Column({type: 'text', nullable: false})
nome_fantasia: string;

@Column({type: 'text', nullable:false})
telefone: string;

@Column({type: 'text', nullable: true})
alvara: string;

@Column({ type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
data_cadastro: Date;

@UpdateDateColumn({ type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
data_atualizacao: Date;
}