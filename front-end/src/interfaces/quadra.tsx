import { EsporteProps } from "./esportes";
import { EstabelecimentoProps } from "./estabelecimento";
import { ImagemProps } from "./image";

export interface QuadraProps {
    idkey: number; // Identificador da quadra
    nome: string; // Nome da quadra
    informacoesAdicionais: string; // Informações adicionais sobre a quadra
    valor: number; // Valor da quadra
    largura: number; // Largura da quadra (string para manter a formatação original)
    comprimento: number; // Comprimento da quadra (string para manter a formatação original)
    coberta: boolean; // Indica se a quadra é coberta
    idkeyEstabelecimento?: number; // Identificador do estabelecimento
    tiposEsporte: EsporteProps[]; // Lista de tipos de esporte
    imagens: ImagemProps[]; // Lista de imagens da quadra
    estabelecimento?: EstabelecimentoProps;
}
