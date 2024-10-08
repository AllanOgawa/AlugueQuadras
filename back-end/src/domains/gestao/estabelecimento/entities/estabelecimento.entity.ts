import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Quadra } from "../quadra/entities/quadra.entity";
import { Usuario } from "@src/auth/usuario/entities/usuario.entity";

@Entity({schema:'gestao', name:'estabelecimento'})
export class Estabelecimento {

@PrimaryGeneratedColumn({type: 'bigint' , primaryKeyConstraintName:'pk_estabelecimento'})
idkey: number;

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

@Column({ type: 'timestamp',  name: 'data_cadastro', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
dataCadastro: Date;

@UpdateDateColumn({ type: 'timestamp', name: 'data_atualizacao' })
dataAtualizacao: Date;

@OneToMany(() => Quadra, quadra => quadra.estabelecimento)
quadras: Quadra[];

@ManyToOne(() => Usuario, usuario => usuario.estabelecimentos, { eager: true })
@JoinColumn({ name: 'idkey_usuario' })
usuario: Usuario;
}