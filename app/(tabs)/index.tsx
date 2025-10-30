import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '@/constants/Colors';

export default function HomeScreen() {
  const { usuario, logout } = useAuth();

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Bem-vindo ao Guia de Livros e Bibliotecas!</Text>
      {usuario ? (
        <View style={estilos.containerLogado}>
          <Text style={estilos.textoBoasVindas}>Olá, {usuario.email}!</Text>
          <Text style={estilos.textoDescricao}>Explore livros, gerencie sua estante e encontre bibliotecas próximas.</Text>
          <Button title="Sair" onPress={logout} color={Colors.error} />
        </View>
      ) : (
        <View style={estilos.containerNaoLogado}>
          <Text style={estilos.textoDescricao}>Faça login para acessar todas as funcionalidades do aplicativo.</Text>
          {/* O botão de login não é necessário aqui, pois o _layout.tsx já redireciona */}
        </View>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.text,
    marginBottom: 20,
  },
  containerLogado: {
    alignItems: 'center',
    marginTop: 20,
  },
  containerNaoLogado: {
    alignItems: 'center',
    marginTop: 20,
  },
  textoBoasVindas: {
    fontSize: 18,
    color: Colors.primary,
    marginBottom: 10,
  },
  textoDescricao: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.mediumGray,
    marginBottom: 20,
  },
});

