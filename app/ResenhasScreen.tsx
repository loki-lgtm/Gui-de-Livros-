import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Colors } from '@/constants/Colors';

// Mock de dados para simular resenhas
let mockResenhas = [
  { id: 'r1', bookId: '1', userId: 'usuario@exemplo.com', titulo: 'Ótima leitura!', texto: 'Gostei muito do livro, bem escrito e informativo.', avaliacao: 5, dataCriacao: '2025-09-20T10:00:00Z' },
  { id: 'r2', bookId: '1', userId: 'outro@exemplo.com', titulo: 'Interessante', texto: 'Alguns pontos poderiam ser mais aprofundados, mas no geral é bom.', avaliacao: 3, dataCriacao: '2025-09-21T11:30:00Z' },
  { id: 'r3', bookId: '2', userId: 'usuario@exemplo.com', titulo: 'Essencial para JS', texto: 'Um livro que todo desenvolvedor JavaScript deveria ler.', avaliacao: 5, dataCriacao: '2025-09-22T14:00:00Z' },
];

// Mock de serviço de resenhas
const servicoResenhas = {
  buscarResenhasPorLivro: async (idLivro) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockResenhas.filter(resenha => resenha.bookId === idLivro));
      }, 300);
    });
  },
  criarResenha: async (dadosResenha) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const novaResenha = { ...dadosResenha, id: `r${mockResenhas.length + 1}`, dataCriacao: new Date().toISOString() };
        mockResenhas.push(novaResenha);
        resolve(novaResenha);
      }, 300);
    });
  },
  atualizarResenha: async (idResenha, dadosAtualizados) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const indice = mockResenhas.findIndex(resenha => resenha.id === idResenha);
        if (indice !== -1) {
          mockResenhas[indice] = { ...mockResenhas[indice], ...dadosAtualizados, dataAtualizacao: new Date().toISOString() };
          resolve(mockResenhas[indice]);
        } else {
          reject(new Error('Resenha não encontrada'));
        }
      }, 300);
    });
  },
  excluirResenha: async (idResenha) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const tamanhoInicial = mockResenhas.length;
        mockResenhas = mockResenhas.filter(resenha => resenha.id !== idResenha);
        if (mockResenhas.length < tamanhoInicial) {
          resolve({ mensagem: 'Resenha excluída com sucesso' });
        } else {
          reject(new Error('Resenha não encontrada'));
        }
      }, 300);
    });
  },
};

// Mock do contexto de autenticação
const useAuth = () => ({
  usuario: { email: 'usuario@exemplo.com' }, // Simula um usuário logado
  estaCarregando: false,
});

// Componente StarRating (simplificado para este arquivo, idealmente seria um componente separado)
const StarRating = ({ avaliacao, aoAvaliar, editavel = true }) => {
  const estrelas = [1, 2, 3, 4, 5];

  return (
    <View style={estilosStar.containerEstrelas}>
      {estrelas.map((estrela) => (
        <TouchableOpacity key={estrela} onPress={() => editavel && aoAvaliar(estrela)} disabled={!editavel}>
          <Text style={[estilosStar.estrela, { color: estrela <= avaliacao ? Colors.secondary : Colors.lightGray }]}>★</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const estilosStar = StyleSheet.create({
  containerEstrelas: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  estrela: {
    fontSize: 24,
    marginRight: 5,
  },
});

export default function ResenhasScreen() {
  const { bookId, bookTitle } = useLocalSearchParams();
  const { usuario } = useAuth();
  const navigation = useNavigation();

  const [resenhas, setResenhas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [tituloResenha, setTituloResenha] = useState('');
  const [textoResenha, setTextoResenha] = useState('');
  const [avaliacao, setAvaliacao] = useState(0);
  const [resenhaEditando, setResenhaEditando] = useState(null);

  const buscarResenhas = useCallback(async () => {
    setCarregando(true);
    try {
      const resenhasLivro = await servicoResenhas.buscarResenhasPorLivro(bookId);
      setResenhas(resenhasLivro);
    } catch (error) {
      console.error('Erro ao carregar resenhas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as resenhas.');
    } finally {
      setCarregando(false);
    }
  }, [bookId]);

  useEffect(() => {
    buscarResenhas();
  }, [buscarResenhas]);

  const handleAdicionarOuAtualizarResenha = async () => {
    if (!usuario) {
      Alert.alert('Erro', 'Você precisa estar logado para escrever uma resenha.');
      // navigation.navigate('LoginScreen'); // Descomentar quando LoginScreen estiver pronta
      return;
    }
    if (!tituloResenha || !textoResenha || avaliacao === 0) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos e dê uma avaliação.');
      return;
    }

    const dadosResenha = {
      bookId,
      userId: usuario.email, // Usando email como userId para simulação
      titulo: tituloResenha,
      texto: textoResenha,
      avaliacao,
    };

    try {
      if (resenhaEditando) {
        await servicoResenhas.atualizarResenha(resenhaEditando.id, dadosResenha);
        Alert.alert('Sucesso', 'Resenha atualizada com sucesso!');
      } else {
        await servicoResenhas.criarResenha(dadosResenha);
        Alert.alert('Sucesso', 'Resenha adicionada com sucesso!');
      }
      setTituloResenha('');
      setTextoResenha('');
      setAvaliacao(0);
      setResenhaEditando(null);
      buscarResenhas();
    } catch (error) {
      console.error('Erro ao salvar resenha:', error);
      Alert.alert('Erro', 'Não foi possível salvar a resenha.');
    }
  };

  const handleEditar = (resenha) => {
    setResenhaEditando(resenha);
    setTituloResenha(resenha.titulo);
    setTextoResenha(resenha.texto);
    setAvaliacao(resenha.avaliacao);
  };

  const handleExcluir = (idResenha) => {
    Alert.alert(
      'Excluir Resenha',
      'Tem certeza que deseja excluir esta resenha?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', onPress: async () => {
            try {
              await servicoResenhas.excluirResenha(idResenha);
              Alert.alert('Sucesso', 'Resenha excluída com sucesso!');
              buscarResenhas();
            } catch (error) {
              console.error('Erro ao excluir resenha:', error);
              Alert.alert('Erro', 'Não foi possível excluir a resenha.');
            }
          }, style: 'destructive' },
      ]
    );
  };

  const renderizarItemResenha = ({ item }) => (
    <View style={estilos.cardResenha}>
      <Text style={estilos.tituloCardResenha}>{item.titulo}</Text>
      <StarRating avaliacao={item.avaliacao} aoAvaliar={() => {}} editavel={false} />
      <Text style={estilos.textoCardResenha}>{item.texto}</Text>
      <Text style={estilos.metaResenha}>Por: {item.userId} em {new Date(item.dataCriacao).toLocaleDateString()}</Text>
      {usuario && usuario.email === item.userId && (
        <View style={estilos.acoesResenha}>
          <Button title="Editar" onPress={() => handleEditar(item)} color={Colors.primary} />
          <Button title="Excluir" color={Colors.error} onPress={() => handleExcluir(item.id)} />
        </View>
      )}
    </View>
  );

  if (carregando) {
    return (
      <View style={estilos.centralizado}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={estilos.container}>
      <Text style={estilos.tituloLivro}>Resenhas para: {bookTitle}</Text>

      <View style={estilos.containerFormulario}>
        <Text style={estilos.tituloFormulario}>{resenhaEditando ? 'Editar Resenha' : 'Escrever uma Resenha'}</Text>
        <TextInput
          style={estilos.entradaTexto}
          placeholder="Título da Resenha"
          placeholderTextColor={Colors.mediumGray}
          value={tituloResenha}
          onChangeText={setTituloResenha}
        />
        <TextInput
          style={[estilos.entradaTexto, estilos.areaTexto]}
          placeholder="Sua resenha..."
          placeholderTextColor={Colors.mediumGray}
          value={textoResenha}
          onChangeText={setTextoResenha}
          multiline
          numberOfLines={4}
        />
        <StarRating avaliacao={avaliacao} aoAvaliar={setAvaliacao} />
        <Button
          title={resenhaEditando ? 'Atualizar Resenha' : 'Adicionar Resenha'}
          onPress={handleAdicionarOuAtualizarResenha}
          color={Colors.secondary}
          disabled={!usuario} // Desabilita se não houver usuário logado
        />
        {!usuario && <Text style={estilos.avisoLogin}>Faça login para escrever uma resenha.</Text>}
        {resenhaEditando && (
          <Button title="Cancelar Edição" onPress={() => {
            setResenhaEditando(null);
            setTituloResenha('');
            setTextoResenha('');
            setAvaliacao(0);
          }} color={Colors.lightGray} />
        )}
      </View>

      <Text style={estilos.tituloSecao}>Todas as Resenhas</Text>
      <FlatList
        data={resenhas}
        keyExtractor={(item) => item.id}
        renderItem={renderizarItemResenha}
        ListEmptyComponent={<Text style={estilos.textoVazio}>Nenhuma resenha ainda. Seja o primeiro a escrever!</Text>}
      />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: Colors.background,
  },
  centralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  tituloLivro: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.text,
    marginBottom: 20,
  },
  containerFormulario: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tituloFormulario: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
  },
  entradaTexto: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: Colors.white,
    color: Colors.text,
  },
  areaTexto: {
    height: 100,
    textAlignVertical: 'top',
  },
  avisoLogin: {
    color: Colors.error,
    textAlign: 'center',
    marginTop: 10,
  },
  tituloSecao: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
  },
  cardResenha: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tituloCardResenha: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 5,
  },
  textoCardResenha: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 5,
  },
  metaResenha: {
    fontSize: 12,
    color: Colors.mediumGray,
    marginBottom: 10,
  },
  acoesResenha: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  textoVazio: {
    textAlign: 'center',
    marginTop: 20,
    color: Colors.mediumGray,
  },
});

