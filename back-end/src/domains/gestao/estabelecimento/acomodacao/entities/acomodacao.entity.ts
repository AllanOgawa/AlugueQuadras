import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
