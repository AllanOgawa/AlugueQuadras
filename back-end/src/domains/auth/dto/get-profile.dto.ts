import { Imagem } from "@src/domains/storage/entities/imagem.entity";

export class GetProfileDto {
  idkey: number;
  nome: string;
  username: string;
  email: string;
  cpf: string;
  dataNascimento: Date;
  dataCadastro: Date;
  tipo:  string;
  imagens?: Imagem[];
}
