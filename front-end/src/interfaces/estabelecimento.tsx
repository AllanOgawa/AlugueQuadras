import { AcomodacoesProps } from "./acomodacoes";
import { AvaliacaoProps } from "./avaliacao";
import { HorarioProps } from "./horario";
import { ImagemProps } from "./image";
import { QuadraProps } from "./quadra";

export interface EstabelecimentoProps {
    id: string;
    name: string;
    endereco: string;
    latitude: number;
    longitude: number;
    sobre: string;
    avaliacao: number;
    image: ImagemProps[];
    acomodacoes: AcomodacoesProps[];
    quadras: QuadraProps[];
    horario: HorarioProps[];
    avaliacoes: AvaliacaoProps[];
}