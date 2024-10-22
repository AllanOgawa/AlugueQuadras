import { AcomodacoesProps } from "./acomodacoes";
import { AvaliacaoProps } from "./avaliacao";
import { HorarioProps } from "./horario";
import { QuadraProps } from "./quadra";

export interface EnderecoProps {
    idkey: number;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    dataCadastro: string;
    dataAtualizacao: string;
}


export interface ImagemProps {
    idkey: number;
    path: string;
    dataCadastro: string;
}

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
    endereco: EnderecoProps;     // Objeto de endereço, conforme detalhado
    imagens: ImagemProps[];      // Lista de imagens
    quadras: QuadraProps[];      // Array vazio por enquanto
}

