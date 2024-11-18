import { AcomodacoesProps } from "./acomodacoes";
import { AvaliacaoProps } from "./avaliacao";
import { HorarioProps } from "./horario";
import { QuadraProps } from "./quadra";
import { EnderecoProps } from "./endereco";
import { ImagemProps } from "./image";

export interface EstabelecimentoProps {
    idkey: number;               // Usando o campo "idkey" diretamente
    cnpj: string;                // "cnpj"
    razaoSocial: string;         // "razaoSocial"
    nome: string;                // "nome"
    telefone: string;            // "telefone"
    email: string;               // "email"
    alvara: string;              // "alvara"
    dataCadastro: string;        // "dataCadastro" (ISO string format)
    dataAtualizacao: string;     // "dataAtualizacao" (ISO string format)
    sobre: string;
    endereco: EnderecoProps;     // Objeto de endereço, conforme detalhado
    imagens: ImagemProps[];      // Lista de imagens
    quadras?: QuadraProps[];
    acomodacoes: AcomodacoesProps[];
    horariosFuncionamento: HorarioProps[];
}

