import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_ESTANTE = '@GuiaLivrosBibliotecas:estante';

// Mock de dados iniciais para a estante
let estanteMock = {
  lidos: [],
  queroLer: [],
};

// Função para carregar a estante do AsyncStorage ou usar o mock inicial
const carregarEstante = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(CHAVE_ESTANTE);
    if (jsonValue != null) {
      estanteMock = JSON.parse(jsonValue);
    }
  } catch (e) {
    console.error('Erro ao carregar estante:', e);
  }
  return estanteMock;
};

// Função para salvar a estante no AsyncStorage
const salvarEstante = async (estante) => {
  try {
    const jsonValue = JSON.stringify(estante);
    await AsyncStorage.setItem(CHAVE_ESTANTE, jsonValue);
    estanteMock = estante; // Atualiza o mock em memória
  } catch (e) {
    console.error('Erro ao salvar estante:', e);
  }
};

// Carrega a estante ao iniciar o serviço
carregarEstante();

export const obterEstante = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(estanteMock);
    }, 200);
  });
};

export const adicionarLivroNaEstante = async (livro, categoria = 'queroLer') => {
  return new Promise(async (resolve) => {
    const estanteAtual = await obterEstante();
    const listaAlvo = estanteAtual[categoria];

    if (!listaAlvo.some(b => b.id === livro.id)) {
      listaAlvo.push(livro);
      await salvarEstante(estanteAtual);
      resolve(true);
    } else {
      resolve(false); // Livro já está na estante
    }
  });
};

export const removerLivroDaEstante = async (idLivro, categoria) => {
  return new Promise(async (resolve) => {
    const estanteAtual = await obterEstante();
    estanteAtual[categoria] = estanteAtual[categoria].filter(livro => livro.id !== idLivro);
    await salvarEstante(estanteAtual);
    resolve(true);
  });
};

export const moverLivroEntreCategorias = async (idLivro, deCategoria, paraCategoria) => {
  return new Promise(async (resolve) => {
    const estanteAtual = await obterEstante();
    const livroParaMover = estanteAtual[deCategoria].find(livro => livro.id === idLivro);

    if (livroParaMover) {
      estanteAtual[deCategoria] = estanteAtual[deCategoria].filter(livro => livro.id !== idLivro);
      if (!estanteAtual[paraCategoria].some(b => b.id === idLivro)) {
        estanteAtual[paraCategoria].push(livroParaMover);
      }
      await salvarEstante(estanteAtual);
      resolve(true);
    } else {
      resolve(false);
    }
  });
};

export const verificarLivroNaEstante = async (idLivro) => {
  return new Promise(async (resolve) => {
    const estanteAtual = await obterEstante();
    const estaLidos = estanteAtual.lidos.some(b => b.id === idLivro);
    const estaQueroLer = estanteAtual.queroLer.some(b => b.id === idLivro);
    resolve(estaLidos || estaQueroLer);
  });
};

