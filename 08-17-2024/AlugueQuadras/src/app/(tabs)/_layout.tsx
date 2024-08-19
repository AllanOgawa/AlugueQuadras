import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons'

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}>

      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarActiveTintColor: "#f97316",
          tabBarInactiveTintColor: "#000000",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              color={color}
              size={28}
              style={{ marginBottom: -3 }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="busca"
        options={{
          title: 'Buscar',
          tabBarActiveTintColor: "#f97316",
          tabBarInactiveTintColor: "#000000",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'search' : 'search-outline'}
              color={color}
              size={28}
              style={{ marginBottom: -3 }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="mapa"
        options={{
          title: 'Mapa',
          tabBarActiveTintColor: "#f97316",
          tabBarInactiveTintColor: "#000000",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'map' : 'map-outline'}
              color={color}
              size={28}
              style={{ marginBottom: -3 }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="reserva"
        options={{
          title: 'Reservas',
          tabBarActiveTintColor: "#f97316",
          tabBarInactiveTintColor: "#000000",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'calendar' : 'calendar-outline'}
              color={color}
              size={28}
              style={{ marginBottom: -3 }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarActiveTintColor: "#f97316",
          tabBarInactiveTintColor: "#000000",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              color={color}
              size={28}
              style={{ marginBottom: -3 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
