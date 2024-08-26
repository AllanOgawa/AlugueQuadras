import { FlatList } from 'react-native';
import { useEffect, useState  } from 'react'
import { CourtItem } from '../lastCourt/courtItem'

// {
//     "id": "1",
//     "ativa": true,
//     "local": "Beach Park Maringá",
//     "endereco": "Av. Nóbrega, 62 - Centro, Maringá - PR, 87014-180",
//     "quadra": "Quadra 1",
//     "data": "20 de Agosto - 2024",
//     "hora": "15:10 - 16:00",
//     "valor": "R$ 80,00",
//     "avaliacao": 0,
//     "image": "https://lh3.googleusercontent.com/p/AF1QipOQxdvkKmMQHYfusdz7ryOnSENXjDZhajZgef5K=s1360-w1360-h1020"
// }

export interface Courtprops{
  id: string;
  local: string;
  image: string;
}

export function LastCourt() {
  const [court, setCourts] = useState<Courtprops[]>([])

  useEffect(() => {
    async function getCourts(){
      const response = await fetch("http://192.168.1.10:3000/reservas")
      const data = await response.json()
      setCourts(data);
    }    
    getCourts();
  }, [])


 return (
  <FlatList
    data={court}
    renderItem={ ({ item }) => <CourtItem item={item} /> }
    horizontal={true}
    contentContainerStyle={{ gap: 14,paddingRight: 16, marginTop: 16}}
    showsHorizontalScrollIndicator={false}
  />
  );
}