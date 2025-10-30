import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import React, { useEffect } from 'react';

import { Colors } from '@/constants/Colors';
import { AuthProvider, useAuth } from '@/context/AuthContext'; // Importar AuthProvider e useAuth

// Definir um tema customizado usando a nova paleta
const CustomTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary,
    background: Colors.background,
    card: Colors.white,
    text: Colors.text,
    border: Colors.lightGray,
    notification: Colors.secondary,
  },
};

function RootLayoutNav() {
  const { usuario, estaCarregando } = useAuth();

  if (estaCarregando) {
    // Ou um splash screen
    return null;
  }

  return (
    <Stack>
      {usuario ? (
        // Rotas para usuários autenticados
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      ) : (
        // Rota para usuários não autenticados
        <Stack.Screen name="LoginScreen" options={{ headerShown: false }} />
      )}
      <Stack.Screen name="DetalhesLivroScreen" options={{ title: 'Detalhes do Livro' }} />
      <Stack.Screen name="ResenhasScreen" options={{ title: 'Resenhas do Livro' }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={CustomTheme}>
        <RootLayoutNav />
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}

