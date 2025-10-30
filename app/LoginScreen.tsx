import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/Colors';

export default function LoginScreen() {
  const { login, estaCarregando } = useAuth();
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Para alternar entre Login e Registro

  const handleAutenticacao = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    // Simulação de autenticação
    if (isLogin) {
      // Lógica de login simulada
      if (email === 'teste@teste.com' && senha === '123456') {
        await login({ email, token: 'mock-token-login' });
        Alert.alert('Sucesso', 'Login realizado com sucesso!');
        navigation.replace('(tabs)'); // Navegar para a tela principal após login
      } else {
        Alert.alert('Erro', 'Email ou senha inválidos.');
      }
    } else {
      // Lógica de registro simulada
      if (email.includes('@') && senha.length >= 6) {
        await login({ email, token: 'mock-token-registro' });
        Alert.alert('Sucesso', 'Registro realizado com sucesso!');
        // navigation.replace('(tabs)'); // Navegar para a tela principal após registro
      } else {
        Alert.alert('Erro', 'Email inválido ou senha muito curta (mínimo 6 caracteres).');
      }
    }
  };

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>{isLogin ? 'Entrar' : 'Registrar'}</Text>

      <TextInput
        style={estilos.entradaTexto}
        placeholder="Email"
        placeholderTextColor={Colors.mediumGray}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={estilos.entradaTexto}
        placeholder="Senha"
        placeholderTextColor={Colors.mediumGray}
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <Button
        title={isLogin ? 'Entrar' : 'Registrar'}
        onPress={handleAutenticacao}
        color={Colors.primary}
        disabled={estaCarregando}
      />

      {estaCarregando && <ActivityIndicator size="small" color={Colors.primary} style={estilos.indicadorCarregamento} />}

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={estilos.alternarBotao}>
        <Text style={estilos.alternarTexto}>
          {isLogin ? 'Não tem uma conta? Registre-se' : 'Já tem uma conta? Faça login'}
        </Text>
      </TouchableOpacity>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 30,
  },
  entradaTexto: {
    width: '100%',
    height: 50,
    borderColor: Colors.lightGray,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: Colors.white,
    color: Colors.text,
  },
  alternarBotao: {
    marginTop: 20,
  },
  alternarTexto: {
    color: Colors.secondary,
    fontSize: 16,
  },
  indicadorCarregamento: {
    marginTop: 10,
  },
});

