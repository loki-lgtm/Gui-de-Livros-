import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from 'expo-router';
import { 
  obterEstante, 
  adicionarLivroNaEstante, 
  removerLivroDaEstante, 
  moverLivroEntreCategorias, 
  verificarLivroNaEstante 
} from '@/services/bookshelfService';
import { Colors } from '@/constants/Colors';

// Componente LivroCard (simplificado para este arquivo, idealmente seria um componente separado)
const LivroCard = ({ livro, aoPressionar }) => {
  const urlImagem = livro.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192.png?text=Sem+Imagem';
  const titulo = livro.volumeInfo.title || 'Título Desconhecido';
  const autores = livro.volumeInfo.authors ? livro.volumeInfo.authors.join(', ') : 'Autor Desconhecido';

  return (
    <TouchableOpacity style={estilosCard.card} onPress={aoPressionar}>
      <View style={estilosCard.containerImagem}>
        <Image source={{ uri: urlImagem }} style={estilosCard.imagemCapa} />
      </View>
      <View style={estilosCard.containerInfo}>
        <Text style={estilosCard.titulo} numberOfLines={2}>{titulo}</Text>
        <Text style={estilosCard.autor} numberOfLines={1}>{autores}</Text>
      </View>
    </TouchableOpacity>
  );
};

const estilosCard = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  containerImagem: {
    width: 90,
    height: 135,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  imagemCapa: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  containerInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  autor: {
    fontSize: 14,
    color: Colors.mediumGray,
  },
});

export default function MinhaEstanteScreen() {
  const navigation = useNavigation();
  const [estante, setEstante] = useState({ lidos: [], queroLer: [] });
  const [carregando, setCarregando] = useState(true);

  // Função para carregar os livros da estante
  const carregarEstanteLivros = useCallback(async () => {
    setCarregando(true);
    const estanteArmazenada = await obterEstante();
    setEstante(estanteArmazenada);
    setCarregando(false);
  }, []);

  // Recarrega a estante sempre que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      carregarEstanteLivros();
    }, [carregarEstanteLivros])
  );

  // Função para remover um livro da estante
  const handleRemover = (idLivro, categoria) => {
    Alert.alert('Remover Livro', 'Tem certeza que deseja remover este livro da sua estante?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', onPress: async () => {
          await removerLivroDaEstante(idLivro, categoria);
          carregarEstanteLivros(); // Recarrega a estante após a remoção
        }, style: 'destructive' },
    ]);
  };

  // Função para mover um livro entre as categorias 'lidos' e 'queroLer'
  const handleMover = async (idLivro, deCategoria, paraCategoria) => {
    await moverLivroEntreCategorias(idLivro, deCategoria, paraCategoria);
    carregarEstanteLivros(); // Recarrega a estante após a movimentação
  };

  // Renderiza cada item de livro na lista
  const renderizarItemLivro = ({ item }, categoria) => (
    <View style={estilos.containerItemLivro}>
      <LivroCard livro={item} aoPressionar={() => navigation.navigate('DetalhesLivroScreen', { bookId: item.id, book: JSON.stringify(item) })} />
      <View style={estilos.containerBotoes}>
        {categoria === 'queroLer' && (
          <Button title="Mover para Lidos" onPress={() => handleMover(item.id, 'queroLer', 'lidos')} color={Colors.primary} />
        )}
        {categoria === 'lidos' && (
          <Button title="Mover para Quero Ler" onPress={() => handleMover(item.id, 'lidos', 'queroLer')} color={Colors.primary} />
        )}
        <Button title="Remover" color={Colors.error} onPress={() => handleRemover(item.id, categoria)} />
      </View>
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
      <Text style={estilos.tituloSecao}>Quero Ler</Text>
      <FlatList
        data={estante.queroLer}
        keyExtractor={(item) => item.id}
        renderItem={(props) => renderizarItemLivro(props, 'queroLer')}
        ListEmptyComponent={<Text style={estilos.textoVazio}>Nenhum livro nesta lista.</Text>}
        scrollEnabled={false} // Desabilita o scroll da FlatList para que o ScrollView principal funcione
      />

      <Text style={estilos.tituloSecao}>Livros Lidos</Text>
      <FlatList
        data={estante.lidos}
        keyExtractor={(item) => item.id}
        renderItem={(props) => renderizarItemLivro(props, 'lidos')}
        ListEmptyComponent={<Text style={estilos.textoVazio}>Nenhum livro nesta lista.</Text>}
        scrollEnabled={false}
      />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 10,
  },
  centralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  tituloSecao: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 16,
  },
  containerItemLivro: {
    marginBottom: 10,
    backgroundColor: Colors.white,
    borderRadius: 8,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  containerBotoes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  textoVazio: {
    textAlign: 'center',
    color: Colors.mediumGray,
    marginVertical: 20,
  },
});

