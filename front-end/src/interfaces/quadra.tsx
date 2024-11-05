import { EsporteProps } from "./esportes";
import { ImagemProps } from "./estabelecimento";

export interface QuadraProps {
    idkey: number; // Identificador da quadra
    nome: string; // Nome da quadra
    informacoesAdicionais: string; // Informações adicionais sobre a quadra
    valor: string; // Valor da quadra
    largura: string; // Largura da quadra (string para manter a formatação original)
    comprimento: string; // Comprimento da quadra (string para manter a formatação original)
    tiposEsporte: EsporteProps[]; // Lista de tipos de esporte
    imagens: ImagemProps[]; // Lista de imagens da quadra
    coberta: boolean; // Indica se a quadra é coberta
}
