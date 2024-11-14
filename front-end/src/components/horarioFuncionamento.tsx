import React, {
    useState,
    useEffect,
    forwardRef,
    useImperativeHandle,
} from 'react';
import { View, Text, TextInput } from 'react-native';

interface Horario {
    diaSemana: number;
    horaAbertura: string;
    horaFechamento: string;
}

interface Props {
    horariosPreenchidos?: Horario[];
}

export interface HorarioFuncionamentoRef {
    getHorarios: () => Horario[];
}

const HorarioFuncionamento = forwardRef<HorarioFuncionamentoRef, Props>(
    ({ horariosPreenchidos = [] }, ref) => {
        const diasDaSemana = [
            { nome: 'Domingo', diaSemana: 0 },
            { nome: 'Segunda-feira', diaSemana: 1 },
            { nome: 'Terça-feira', diaSemana: 2 },
            { nome: 'Quarta-feira', diaSemana: 3 },
            { nome: 'Quinta-feira', diaSemana: 4 },
            { nome: 'Sexta-feira', diaSemana: 5 },
            { nome: 'Sábado', diaSemana: 6 },
        ];

        const [horarios, setHorarios] = useState<{
            [key: number]: { horaAbertura: string; horaFechamento: string };
        }>({});

        // Inicializa os horários com os horários já preenchidos
        useEffect(() => {
            const horariosIniciais: {
                [key: number]: { horaAbertura: string; horaFechamento: string };
            } = {};
            horariosPreenchidos.forEach((horario) => {
                horariosIniciais[horario.diaSemana] = {
                    horaAbertura: horario.horaAbertura,
                    horaFechamento: horario.horaFechamento,
                };
            });
            setHorarios(horariosIniciais);
        }, [horariosPreenchidos]);

        const aplicarMascaraHorario = (valor: string) => {
            const num = valor.replace(/\D/g, '');
            if (num.length > 3) {
                let horas = num.slice(0, 2).padStart(2, '0');
                let minutos = num.slice(2, 4).padEnd(2, '0');
                if (Number(horas) > 23) horas = "00";
                if (Number(minutos) > 59) minutos = "00";
                return `${horas}:${minutos}`;
            }
            return num
        };

        const handleChangeHorario = (
            diaSemana: number,
            tipo: 'horaAbertura' | 'horaFechamento',
            valor: string
        ) => {
            const horarioComMascara = aplicarMascaraHorario(valor);
            setHorarios((prev) => ({
                ...prev,
                [diaSemana]: { ...prev[diaSemana], [tipo]: horarioComMascara },
            }));
        };

        useImperativeHandle(ref, () => ({
            getHorarios: () => {
                const horariosValidos: Horario[] = [];
                let erro = false;
                let diaComErro = '';

                diasDaSemana.forEach(({ diaSemana, nome }) => {
                    const horario = horarios[diaSemana];
                    if (horario) {
                        const { horaAbertura, horaFechamento } = horario;
                        if (horaAbertura && horaFechamento) {
                            horariosValidos.push({
                                diaSemana,
                                horaAbertura: `${horaAbertura}:00`,
                                horaFechamento: `${horaFechamento}:00`,
                            });
                        } else if (horaAbertura || horaFechamento) {
                            erro = true;
                            diaComErro = nome;
                        }
                    }
                });

                if (erro) {
                    throw new Error(
                        `Preencha ambos os horários (abertura e fechamento) para o dia ${diaComErro} ou deixe ambos vazios.`
                    );
                }

                return horariosValidos;
            },
        }));

        return (
            <View className='mt-3'>
                {diasDaSemana.map(({ nome, diaSemana }) => (
                    <View key={diaSemana} className='mb-4'>
                        <Text className='text-lg'>{nome}</Text>
                        <TextInput
                            placeholder="Hora de Abertura"
                            value={horarios[diaSemana]?.horaAbertura || ''}
                            onChangeText={(valor) =>
                                handleChangeHorario(diaSemana, 'horaAbertura', valor)
                            }
                            keyboardType="numeric"
                            className={`h-12 rounded-xl border pl-3 text-lg border-secondary`}
                        />
                        <TextInput
                            placeholder="Hora de Fechamento"
                            value={horarios[diaSemana]?.horaFechamento || ''}
                            onChangeText={(valor) =>
                                handleChangeHorario(diaSemana, 'horaFechamento', valor)
                            }
                            keyboardType="numeric"
                            className={`h-12 rounded-xl border pl-3 text-lg mt-1 border-secondary`}
                        />
                    </View>
                ))}
            </View>
        );
    }
);

export default HorarioFuncionamento;
