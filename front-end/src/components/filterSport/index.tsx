import globalStyles from '@src/styles/globalStyles';
import { Pressable, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'

export function FilterSport() {
  return (
    <View className='w-full mt-2 mb-4'>
      <View className='flex-row justify-between'>

        <Pressable
          style={globalStyles.box2}
          className='h-20 w-[49%] rounded-2xl bg-primary
          flex-row items-center justify-between px-1'
          key="1"
          onPress={() => console.log("Clicou filtro Beach Tennis")}
        >
          <Text className='text-white text-xl ml-1'>Beach Tennis</Text>
          <MaterialIcons name="sports-tennis" size={40} color="white" />
        </Pressable>

        <Pressable
          style={globalStyles.box2}
          className='h-20 w-[49%] rounded-2xl bg-primary 
          flex-row items-center justify-between px-1'
          key="2"
          onPress={() => console.log("Clicou filtro Voleibol")}
        >
          <Text className='text-white text-xl ml-1'>Voleibol</Text>
          <MaterialIcons name="sports-volleyball" size={40} color="white" />
        </Pressable>

      </View>

      <View className='flex-row justify-between mt-3'>

        <Pressable
          style={globalStyles.box2}
          className='h-20 w-[49%] rounded-2xl bg-primary 
          flex-row items-center justify-between px-1'
          key="3"
          onPress={() => console.log("Clicou filtro Futsal")}
        >
          <Text className='text-white text-xl ml-1'>Futsal</Text>
          <MaterialIcons name="sports-soccer" size={40} color="white" />
        </Pressable>

        <Pressable
          style={globalStyles.box2}
          className='h-20 w-[49%] rounded-2xl bg-primary 
          flex-row items-center justify-between px-1'
          key="4"
          onPress={() => console.log("Clicou filtro Basquete")}
        >
          <Text className='text-white text-xl ml-1'>Basquete</Text>
          <MaterialIcons name="sports-basketball" size={40} color="white" />
        </Pressable>

      </View>

      <View className='mt-3'>
        <Pressable
          style={globalStyles.box2}
          className='w-full h-12 rounded-2xl bg-gray-300
          flex-row items-center justify-center px-1'
          key="5"
          onPress={() => console.log("Clicou Mais Quadras")}
        >
          <Text className='text-gray-800 text-xl'>Mais Quadras</Text>
          <MaterialIcons name="sports-handball" size={23} color='#1f2937' />
        </Pressable>
      </View>

    </View>
  );
}