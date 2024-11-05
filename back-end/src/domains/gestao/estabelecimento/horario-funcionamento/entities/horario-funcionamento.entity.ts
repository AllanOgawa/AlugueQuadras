import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Estabelecimento } from "@src/domains/gestao/estabelecimento/entities/estabelecimento.entity";
import { DiaSemana } from "../enums/dia-semana.enum";

@Entity({ schema: 'gestao', name: 'horario_funcionamento' })
export class HorarioFuncionamento {

  @PrimaryGeneratedColumn({ type: 'bigint', primaryKeyConstraintName: 'pk_horario_funcionamento' })
  idkey: number;

  @Column({ type: 'enum', enum: DiaSemana, name: 'dia_semana', nullable: false })
  diaSemana: DiaSemana;

  @Column({ type: 'time', name: 'hora_abertura', nullable: false })
  horaAbertura: string;

  @Column({ type: 'time', name: 'hora_fechamento', nullable: false })
  horaFechamento: string;

  @ManyToOne(() => Estabelecimento, estabelecimento => estabelecimento.horariosFuncionamento)
  @JoinColumn({ name: 'idkey_estabelecimento' })
  estabelecimento: Estabelecimento;
}
