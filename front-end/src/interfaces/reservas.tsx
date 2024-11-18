import { QuadraProps } from "./quadra";

export interface ReservasProps {
    idkey: number;
    dataInicio: string;
    dataFim: string;
    cancelada: boolean;
    quadra: QuadraProps;
    usuario?: {
        username: string;
    }
}