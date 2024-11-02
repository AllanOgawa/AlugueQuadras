import { UsuarioProps } from "./usuario";

export interface AvaliacaoProps {
    id: string;
    nota: number;
    titulo: string;
    texto: string;
    dia: string;
    usuario: UsuarioProps;
    quadra: string;
}