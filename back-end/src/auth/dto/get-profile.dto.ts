export class GetProfileDto {
  idkey: number;
  nome: string;
  username: string;
  email: string;
  cpf: string;
  dataNascimento: Date;
  dataCadastro: Date;
  tipo: {
    idkey: number;
    descricao: string;
  };
  imagem?: string;
}
