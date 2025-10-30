import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from 'expo-router';
import { Colors } from '@/constants/Colors';

// Mock de dados para simular a Google Books API
const mockBooks = [
  {
    id: '1',
    volumeInfo: {
      title: 'React Native for Beginners',
      authors: ['John Doe'],
      imageLinks: { thumbnail: 'https://via.placeholder.com/128x192.png?text=RN+Book' },
      description: 'A comprehensive guide to building mobile apps with React Native.',
      publishedDate: '2023-01-01',
      pageCount: 300,
      industryIdentifiers: [{ type: 'ISBN_13', identifier: '978-1234567890' }],
    },
  },
  {
    id: '2',
    volumeInfo: {
      title: 'Mastering JavaScript',
      authors: ['Jane Smith'],
      imageLinks: { thumbnail: 'https://via.placeholder.com/128x192.png?text=JS+Book' },
      description: 'Dive deep into the world of JavaScript and become a master.',
      publishedDate: '2022-05-15',
      pageCount: 500,
      industryIdentifiers: [{ type: 'ISBN_13', identifier: '978-0987654321' }],
    },
  },
  {
    id: '3',
    volumeInfo: {
      title: 'The Art of Programming',
      authors: ['Alan Turing'],
      imageLinks: { thumbnail: 'https://via.placeholder.com/128x192.png?text=Code+Book' },
      description: 'An insightful look into the principles of programming.',
      publishedDate: '1970-10-26',
      pageCount: 250,
      industryIdentifiers: [{ type: 'ISBN_13', identifier: '978-1122334455' }],
    },
  },
  {
    id: '4',
    volumeInfo: {
      title: 'Data Structures in Python',
      authors: ['Guido van Rossum'],
      imageLinks: { thumbnail: 'https://via.placeholder.com/128x192.png?text=Python+DS' },
      description: 'Learn about efficient data structures using Python.',
      publishedDate: '2021-03-20',
      pageCount: 400,
      industryIdentifiers: [{ type: 'ISBN_13', identifier: '978-5566778899' }],
    },
  },
  {
    id: '5',
    volumeInfo: {
      title: 'Mobile App Design Principles',
      authors: ['UI/UX Team'],
      imageLinks: { thumbnail: 'https://via.placeholder.com/128x192.png?text=Design+Book' },
      description: 'Best practices for designing intuitive mobile applications.',
      publishedDate: '2024-02-10',
      pageCount: 280,
      industryIdentifiers: [{ type: 'ISBN_13', identifier: '978-9988776655' }],
    },
  },
];

// Componente BookCard (simplificado para este arquivo, idealmente seria um componente separado)
const BookCard = ({ book, onPress }) => {
  const imageUrl = book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192.png?text=No+Image';
  const title = book.volumeInfo.title || 'Título Desconhecido';
  const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Autor Desconhecido';

  return (
    <TouchableOpacity style={bookCardStyles.card} onPress={onPress}>
      <View style={bookCardStyles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={bookCardStyles.coverImage} />
      </View>
      <View style={bookCardStyles.infoContainer}>
        <Text style={bookCardStyles.title} numberOfLines={2}>{title}</Text>
        <Text style={bookCardStyles.author} numberOfLines={1}>{authors}</Text>
      </View>
    </TouchableOpacity>
  );
};

const bookCardStyles = StyleSheet.create({
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
  imageContainer: {
    width: 90,
    height: 135,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: Colors.mediumGray,
  },
});

export default function ExploreScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchBooks = useCallback(async (query, pageNum) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      // Simulação de API com filtro por título ou autor
      const filteredBooks = mockBooks.filter(book =>
        book.volumeInfo.title.toLowerCase().includes(query.toLowerCase()) ||
        book.volumeInfo.authors?.some(author => author.toLowerCase().includes(query.toLowerCase()))
      );

      // Simulação de paginação
      const startIndex = pageNum * 10;
      const endIndex = startIndex + 10;
      const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

      if (paginatedBooks.length > 0) {
        setBooks(prevBooks => (pageNum === 0 ? paginatedBooks : [...prevBooks, ...paginatedBooks]));
        setHasMore(paginatedBooks.length === 10); // Assume 10 resultados por página
      } else {
        setHasMore(false);
        if (pageNum === 0) setBooks([]); // Limpa se não houver resultados na primeira página
      }
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore]);

useEffect(() => {
  let handler: NodeJS.Timeout;

  const fetchDebounced = () => {
    setPage(0);           // Reset pagination only on new query
    setHasMore(true);
    fetchBooks(searchQuery, 0);
  };

  if (searchQuery === "") {
    fetchBooks("", 0);
  } else {
    handler = setTimeout(fetchDebounced, 500); // Debounce typing
  }

  return () => clearTimeout(handler);
}, [searchQuery]);


  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
      fetchBooks(searchQuery, page + 1);
    }
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loadingMore}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar livros por título ou autor..."
        placeholderTextColor={Colors.mediumGray}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookCard
            book={item}
            onPress={() =>
              (navigation as any).navigate('DetalhesLivroScreen', {
                bookId: item.id,
              })
            }          />
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={!loading && <Text style={styles.emptyText}>Nenhum livro encontrado.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchInput: {
    height: 40,
    borderColor: Colors.lightGray,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    margin: 16,
    backgroundColor: Colors.white,
    color: Colors.text,
  },
  loadingMore: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: Colors.lightGray,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: Colors.mediumGray,
  },
});

