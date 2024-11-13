import { View, Text } from 'react-native';
import { HorarioProps } from '@src/interfaces/horario';
import { useEffect, useState } from 'react';

export interface HorariosFormatProps {
    dia: string;
    diaSemana: number;
    fechado: boolean;
    horario: string;
}


export default function HorarioEstabelecimento({ horarios }: { horarios: HorarioProps[] }) {
    const [horariosFormat, setHorariosFormat] = useState<HorariosFormatProps[]>([]);

    const diasSemana = [
        { dia: "Domingo", diaSemana: 0 },
        { dia: "Segunda", diaSemana: 1 },
        { dia: "Terça", diaSemana: 2 },
        { dia: "Quarta", diaSemana: 3 },
        { dia: "Quinta", diaSemana: 4 },
        { dia: "Sexta", diaSemana: 5 },
        { dia: "Sábado", diaSemana: 6 }
    ];

    useEffect(() => {
        (async () => {
            setHorariosFormat(diasSemana.map(({ dia, diaSemana }) => {
                const horarioEncontrado = horarios.find(item => item.diaSemana === diaSemana);

                if (horarioEncontrado) {
                    const horaAbertura = horarioEncontrado.horaAbertura.split(":").slice(0, 2).join(":");
                    const horaFechamento = horarioEncontrado.horaFechamento.split(":").slice(0, 2).join(":");

                    return {
                        dia,
                        diaSemana,
                        fechado: false,
                        horario: `${horaAbertura} - ${horaFechamento}`
                    };
                } else {
                    return {
                        dia,
                        diaSemana,
                        fechado: true,
                        horario: "Fechado"
                    };
                }
            }))
        })();
    }, []);


    return (
        <View>
            {horariosFormat.map((horario) => (
                <View key={horario.diaSemana} className='flex-1 flex-row w-full'>
                    <Text className='text-base leading-5 font-bold w-[25%]' numberOfLines={1} >
                        {horario.dia}
                    </Text>
                    <View>
                        <Text className='text-base leading-5' numberOfLines={1} >
                            {horario.horario}
                        </Text>
                    </View>
                </View>
            ))
            }
        </View>
    );
}