import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,  } from "typeorm";

@Entity({schema:'gestao', name:'estabelecimento'})
export class Estabelecimento {

@PrimaryGeneratedColumn({type: 'bigint' , primaryKeyConstraintName:'pk_estabelecimento'})
idKey:number;

@Column({type: 'text', nullable: false, unique: true})
cnpj: string;

@Column({type: 'text', name: 'razao_social', nullable: false})
razaoSocial: string

@Column({type: 'text', nullable:false})
telefone: string

@Column({ type: 'text', nullable: false, unique: true })
email: string;

@Column({type: 'text', nullable: true})
alvara: string;

@CreateDateColumn({type: 'timestamp', name: 'data_cadastro'})
dataCadastro: Date;

@UpdateDateColumn({ type: 'timestamp', name: 'data_atualizacao' })
dataAtualizacao: Date;
}