export class GetProfileDto {
  idkey: number;
  nome: string;
  username: string;
  email: string;
  cpf: string;
  data_nascimento: Date;
  data_cadastro: Date;
  tipo: {
    idkey: number;
    descricao: string;
  };
  imagem?: string;
}
