import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_ESTANTE = '@GuiaLivrosBibliotecas:estante';

// Função para carregar a estante do AsyncStorage
export const obterEstante = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(CHAVE_ESTANTE);
    if (jsonValue != null) {
      return JSON.parse(jsonValue);
    }
  } catch (e) {
    console.error('Erro ao carregar estante:', e);
  }
  return { lidos: [], queroLer: [] };
};

// Salvar estante no AsyncStorage
export const salvarEstante = async (estante) => {
  try {
    const jsonValue = JSON.stringify(estante);
    await AsyncStorage.setItem(CHAVE_ESTANTE, jsonValue);
  } catch (e) {
    console.error('Erro ao salvar estante:', e);
  }
};

// Adicionar livro
export const adicionarLivroNaEstante = async (livro, categoria = 'queroLer') => {
  const estanteAtual = await obterEstante();
  const listaAlvo = estanteAtual[categoria];

  if (!listaAlvo.some(b => b.id === livro.id)) {
    listaAlvo.push(livro);
    await salvarEstante(estanteAtual);
    return true;
  }
  return false; // Livro já está na estante
};

// Remover livro
export const removerLivroDaEstante = async (idLivro, categoria) => {
  const estanteAtual = await obterEstante();
  estanteAtual[categoria] = estanteAtual[categoria].filter(l => l.id !== idLivro);
  await salvarEstante(estanteAtual);
  return true;
};

// Mover livro entre categorias
export const moverLivroEntreCategorias = async (idLivro, deCategoria, paraCategoria) => {
  const estanteAtual = await obterEstante();
  const livroParaMover = estanteAtual[deCategoria].find(l => l.id === idLivro);
  if (!livroParaMover) return false;

  estanteAtual[deCategoria] = estanteAtual[deCategoria].filter(l => l.id !== idLivro);
  if (!estanteAtual[paraCategoria].some(b => b.id === idLivro)) {
    estanteAtual[paraCategoria].push(livroParaMover);
  }
  await salvarEstante(estanteAtual);
  return true;
};

// Verificar se livro está na estante
export const verificarLivroNaEstante = async (idLivro) => {
  const estanteAtual = await obterEstante();
  const estaLidos = estanteAtual.lidos.some(b => b.id === idLivro);
  const estaQueroLer = estanteAtual.queroLer.some(b => b.id === idLivro);
  return estaLidos || estaQueroLer;
};
