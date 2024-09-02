import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'admin', name: 'usuario' })
export class Usuario {
  @PrimaryGeneratedColumn()
  idkey: number;

  @Column()
  idkey_tipo_usuario: number;

  @Column({ unique: true })
  email: string;

  @Column()
  senha: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  data_cadastro: Date;
}
