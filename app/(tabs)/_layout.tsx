import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Importar ícones

import { Colors } from '@/constants/Colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.secondary,
        tabBarInactiveTintColor: Colors.mediumGray,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.white, // Fundo da barra de abas
          borderTopColor: Colors.lightGray, // Cor da borda superior da barra de abas
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialIcons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color }) => <MaterialIcons name="search" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="minhaEstante"
        options={{
          title: 'Minha Estante',
          tabBarIcon: ({ color }) => <MaterialIcons name="book" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="mapa"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color }) => <MaterialIcons name="map" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

