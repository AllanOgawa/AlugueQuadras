import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'admin', name: 'usuario' })
export class Usuario {
  @PrimaryGeneratedColumn()
  idkey: number;

  @Column({ nullable: false })  
  idkey_tipo_usuario: number;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  senha: string;

  @Column({ type: 'timestamp' }) 
  data_cadastro: Date;
}
