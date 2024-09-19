import { AcomodacoesProps } from "./acomodacoes";
import { HorarioProps } from "./horario";
import { ImagemProps } from "./image";
import { QuadraProps } from "./quadra";

export interface EstabelecimentoProps {
    id: string;
    name: string;
    endereco: string;
    latitude: number;
    longitude: number;
    avaliacao: number;
    sobre: string;
    image: ImagemProps[];
    acomodacoes: AcomodacoesProps[];
    quadras: QuadraProps[];
    horario: HorarioProps[];
}