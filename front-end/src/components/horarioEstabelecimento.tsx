import { View, Text } from 'react-native';
import { HorarioProps } from '@src/interfaces/horario';

export default function HorarioEstabelecimento({ horarios }: { horarios: HorarioProps[] }) {
    return (
        <View>
            {horarios.map((horario, index) => (
                <View key={horario.dia} className='flex-1 flex-row w-full'>
                    <Text className='text-base leading-5 font-bold w-[25%]' numberOfLines={1} >
                        {horario.dia}
                    </Text>
                    <View>
                        <Text className='text-base leading-5' numberOfLines={1} >
                            {horario.horario1}
                            {(horario.horario2 == "") ? "" : ` - ${horario.horario2}`}
                        </Text>
                    </View>
                </View>
            ))
            }
        </View>
    );
}