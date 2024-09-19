import { EsportesProps } from "./esportes";

export interface QuadraProps {
    id: string;
    name: string;
    comprimento: number;
    largura: number;
    image: string;
    valor: string;
    esportes: EsportesProps[];
}