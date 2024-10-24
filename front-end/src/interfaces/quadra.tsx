import { EsportesProps } from "./esportes";

export interface QuadraProps {
    idkey: string;
    local: any;
    endereco: any;
    id: string;
    name: string;
    comprimento: number;
    largura: number;
    image: string;
    valor: string;
    esportes: EsportesProps[];
}