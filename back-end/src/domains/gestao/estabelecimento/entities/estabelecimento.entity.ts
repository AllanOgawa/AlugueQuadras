import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { Quadra } from "../quadra/entities/quadra.entity";

import { Usuario }  from "@src/domains/auth/usuario/entities/usuario.entity";
import { Imagem }   from "@src/domains/storage/imagem/entities/imagem.entity";

@Entity({schema:'gestao', name:'estabelecimento'})
export class Estabelecimento {

@PrimaryGeneratedColumn({type: 'bigint' , primaryKeyConstraintName:'pk_estabelecimento'})
idkey: number;

@Column({type: 'text', nullable: false, unique: true})
cnpj: string;

@Column({type: 'text', name: 'razao_social', nullable: false})
razaoSocial: string

@Column({type: 'text', nullable: false})
nome: string

@Column({type: 'text', nullable: false})
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

@ManyToOne(() => Usuario, usuario => usuario.estabelecimentos)
@JoinColumn({ name: 'idkey_usuario' })
usuario: Usuario;

@ManyToMany(() => Imagem, { eager: true, nullable: true, cascade: true})
@JoinTable({
  name: 'rel_estabelecimento_imagem',
  joinColumn: { name: 'idkey_estabelecimento', referencedColumnName: 'idkey' },
  inverseJoinColumn: { name: 'idkey_imagem', referencedColumnName: 'idkey' }
})
imagens: Imagem[];
}