import * as Location from 'expo-location';

// Mock de dados para bibliotecas próximas
const mockBibliotecas = [
  {
    id: 'lib1',
    nome: 'Biblioteca Central da Cidade',
    endereco: 'Rua Principal, 123, Centro',
    horarioFuncionamento: 'Seg-Sex: 9h-18h, Sáb: 9h-13h',
    latitude: -23.550520, // Exemplo de coordenada para São Paulo
    longitude: -46.633308,
  },
  {
    id: 'lib2',
    nome: 'Biblioteca Comunitária do Bairro',
    endereco: 'Av. Secundária, 456, Bairro Feliz',
    horarioFuncionamento: 'Seg-Sex: 10h-17h',
    latitude: -23.560000,
    longitude: -46.640000,
  },
  {
    id: 'lib3',
    nome: 'Centro de Leitura Municipal',
    endereco: 'Praça da Cultura, 789, Vila Nova',
    horarioFuncionamento: 'Ter-Sáb: 11h-19h',
    latitude: -23.545000,
    longitude: -46.625000,
  },
];

// Função para simular a obtenção da localização atual do usuário
export const obterLocalizacaoAtual = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    console.error('Permissão de localização não concedida');
    return null;
  }

  // Simula uma localização fixa para testes
  const localizacaoMock = {
    coords: {
      latitude: -23.550520, // Centro de São Paulo
      longitude: -46.633308,
      accuracy: 5,
      altitude: 0,
      altitudeAccuracy: 0,
      heading: 0,
      speed: 0,
    },
    timestamp: Date.now(),
  };
  return localizacaoMock;
};

// Função para simular a busca de bibliotecas próximas
export const buscarBibliotecasProximas = async (latitude, longitude, raioKm = 10) => {
  return new Promise(resolve => {
    setTimeout(() => {
      // Filtra bibliotecas dentro de um raio simulado (todas as mockadas estão dentro)
      const bibliotecasFiltradas = mockBibliotecas.map(lib => {
        // Simula cálculo de distância (apenas para exibição, não é um cálculo geográfico preciso)
        const distancia = Math.floor(Math.random() * 5) + 1; // Distância aleatória entre 1 e 5 km
        return { ...lib, distancia };
      });
      resolve(bibliotecasFiltradas);
    }, 500);
  });
};

// Função para abrir rotas no GPS (apenas simulação, pois não há navegador no sandbox)
export const abrirRotasNoGPS = (latitude, longitude, nomeLocal) => {
  const url = Platform.select({
    ios: `maps:0,0?q=${nomeLocal}@${latitude},${longitude}`,
    android: `geo:0,0?q=${latitude},${longitude}(${nomeLocal})`,
  });
  console.log(`Simulando abertura de rotas para: ${nomeLocal} em ${url}`);
  // Linking.openURL(url); // Descomentar para uso real em dispositivo
  Alert.alert('Abrir Rotas', `Simulando abertura de rotas para ${nomeLocal} no GPS.`);
};

