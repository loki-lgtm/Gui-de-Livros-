import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, Button, Alert } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Colors } from '@/constants/Colors';

// Mock de dados para simular a busca de detalhes de um livro
const mockBookDetails = {
  '1': {
    id: '1',
    volumeInfo: {
      title: 'React Native para Iniciantes',
      authors: ['João Silva'],
      imageLinks: { thumbnail: 'https://via.placeholder.com/150x225.png?text=RN+Livro', large: 'https://via.placeholder.com/300x450.png?text=RN+Livro+Grande' },
      description: 'Um guia completo para construir aplicativos móveis com React Native, desde o básico até tópicos avançados.',
      publishedDate: '2023-01-01',
      pageCount: 300,
      industryIdentifiers: [{ type: 'ISBN_13', identifier: '978-1234567890' }],
    },
  },
  '2': {
    id: '2',
    volumeInfo: {
      title: 'Dominando JavaScript',
      authors: ['Maria Souza'],
      imageLinks: { thumbnail: 'https://via.placeholder.com/150x225.png?text=JS+Livro', large: 'https://via.placeholder.com/300x450.png?text=JS+Livro+Grande' },
      description: 'Aprofunde-se no mundo do JavaScript e torne-se um mestre na linguagem.',
      publishedDate: '2022-05-15',
      pageCount: 500,
      industryIdentifiers: [{ type: 'ISBN_13', identifier: '978-0987654321' }],
    },
  },
  '3': {
    id: '3',
    volumeInfo: {
      title: 'A Arte da Programação',
      authors: ['Alan Turing'],
      imageLinks: { thumbnail: 'https://via.placeholder.com/150x225.png?text=Código+Livro', large: 'https://via.placeholder.com/300x450.png?text=Código+Livro+Grande' },
      description: 'Uma visão perspicaz sobre os princípios fundamentais da programação e seu impacto na tecnologia.',
      publishedDate: '1970-10-26',
      pageCount: 250,
      industryIdentifiers: [{ type: 'ISBN_13', identifier: '978-1122334455' }],
    },
  },
  '4': {
    id: '4',
    volumeInfo: {
      title: 'Estruturas de Dados em Python',
      authors: ['Guido van Rossum'],
      imageLinks: { thumbnail: 'https://via.placeholder.com/150x225.png?text=Python+ED', large: 'https://via.placeholder.com/300x450.png?text=Python+ED+Grande' },
      description: 'Aprenda sobre estruturas de dados eficientes usando a linguagem de programação Python.',
      publishedDate: '2021-03-20',
      pageCount: 400,
      industryIdentifiers: [{ type: 'ISBN_13', identifier: '978-5566778899' }],
    },
  },
  '5': {
    id: '5',
    volumeInfo: {
      title: 'Princípios de Design de Apps Móveis',
      authors: ['Equipe UI/UX'],
      imageLinks: { thumbnail: 'https://via.placeholder.com/150x225.png?text=Design+Livro', large: 'https://via.placeholder.com/300x450.png?text=Design+Livro+Grande' },
      description: 'Melhores práticas para projetar aplicativos móveis intuitivos e eficazes.',
      publishedDate: '2024-02-10',
      pageCount: 280,
      industryIdentifiers: [{ type: 'ISBN_13', identifier: '978-9988776655' }],
    },
  },
};

// Mock de serviço para a estante de livros
const bookshelfService = {
  adicionarLivro: async (livro, categoria = 'queroLer') => {
    console.log(`Livro '${livro.volumeInfo.title}' adicionado à categoria '${categoria}'.`);
    return true; // Simula sucesso
  },
  estaNaEstante: async (idLivro) => {
    // Simula se o livro já está na estante
    return idLivro === '1'; // Exemplo: livro com ID '1' já está na estante
  },
};

export default function DetalhesLivroScreen() {
  const { bookId, book } = useLocalSearchParams(); // Obtém o ID do livro e o objeto book da navegação
  const navigation = useNavigation();
  const [livro, setLivro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [estaNaEstante, setEstaNaEstante] = useState(false);

  useEffect(() => {
    const buscarDetalhesLivro = async () => {
      try {
        // Usa o objeto book passado via params ou busca nos mocks se apenas o ID for passado
        const dadosLivro = book ? JSON.parse(book) : mockBookDetails[bookId];
        setLivro(dadosLivro);
        const naEstante = await bookshelfService.estaNaEstante(bookId);
        setEstaNaEstante(naEstante);
      } catch (error) {
        console.error('Erro ao buscar detalhes do livro:', error);
      } finally {
        setCarregando(false);
      }
    };

    buscarDetalhesLivro();
  }, [bookId, book]);

  // Função para adicionar o livro à estante
  const handleAdicionarEstante = async () => {
    if (livro) {
      const adicionado = await bookshelfService.adicionarLivro(livro, 'queroLer');
      if (adicionado) {
        Alert.alert('Sucesso', 'Livro adicionado à sua estante (Quero Ler)!');
        setEstaNaEstante(true);
      } else {
        Alert.alert('Aviso', 'Este livro já está na sua estante.');
      }
    }
  };

  if (carregando) {
    return (
      <View style={estilos.centralizado}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!livro) {
    return (
      <View style={estilos.centralizado}>
        <Text style={estilos.textoErro}>Livro não encontrado.</Text>
      </View>
    );
  }

  const { volumeInfo } = livro;
  const urlImagem = volumeInfo.imageLinks?.large || volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150x225.png?text=Sem+Imagem';
  const titulo = volumeInfo.title || 'Título Desconhecido';
  const autores = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Autor Desconhecido';
  const descricao = volumeInfo.description || 'Sem descrição disponível.';
  const dataPublicacao = volumeInfo.publishedDate || 'Desconhecido';
  const numeroPaginas = volumeInfo.pageCount || 'Desconhecido';
  const isbn = volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier || 'Não disponível';

  return (
    <ScrollView style={estilos.container}>
      <View style={estilos.cabecalho}>
        <Image source={{ uri: urlImagem }} style={estilos.imagemCapa} />
        <Text style={estilos.titulo}>{titulo}</Text>
        <Text style={estilos.autor}>{autores}</Text>
      </View>
      <View style={estilos.detalhes}>
        <Text style={estilos.rotulo}>Sinopse:</Text>
        <Text style={estilos.descricao}>{descricao}</Text>
        <Text style={estilos.rotulo}>Ano de Publicação:</Text>
        <Text style={estilos.textoDetalhe}>{dataPublicacao}</Text>
        <Text style={estilos.rotulo}>Número de Páginas:</Text>
        <Text style={estilos.textoDetalhe}>{numeroPaginas}</Text>
        <Text style={estilos.rotulo}>ISBN:</Text>
        <Text style={estilos.textoDetalhe}>{isbn}</Text>
      </View>
      <View style={estilos.acoes}>
        <Button
          title={estaNaEstante ? "Já na Estante" : "Adicionar à Minha Estante"}
          onPress={handleAdicionarEstante}
          color={estaNaEstante ? Colors.mediumGray : Colors.success}
          disabled={estaNaEstante}
        />
        <Button
          title="Escrever Resenha"
          onPress={() => navigation.navigate('ResenhasScreen', { bookId: livro.id, bookTitle: titulo })} // Navega para a tela de resenhas
          color={Colors.secondary}
        />
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 15,
  },
  centralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  textoErro: {
    color: Colors.error,
    fontSize: 16,
  },
  cabecalho: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagemCapa: {
    width: 180,
    height: 270,
    resizeMode: 'contain',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: Colors.lightGray,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.text,
    marginBottom: 5,
  },
  autor: {
    fontSize: 18,
    color: Colors.primary,
    textAlign: 'center',
  },
  detalhes: {
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
  rotulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: Colors.text,
  },
  descricao: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
    color: Colors.text,
  },
  textoDetalhe: {
    fontSize: 14,
    color: Colors.text,
  },
  acoes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
});

