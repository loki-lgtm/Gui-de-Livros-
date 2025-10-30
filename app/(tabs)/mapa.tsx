import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Colors } from '@/constants/Colors';
import { obterLocalizacaoAtual, buscarBibliotecasProximas, abrirRotasNoGPS } from '@/services/locationService';
import { MaterialIcons } from '@expo/vector-icons';

export default function MapaScreen() {
  const [localizacaoAtual, setLocalizacaoAtual] = useState(null);
  const [bibliotecas, setBibliotecas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroMensagem, setErroMensagem] = useState('');

  useEffect(() => {
    const carregarDadosDoMapa = async () => {
      try {
        // 1. Obter localização atual do usuário
        const loc = await obterLocalizacaoAtual();
        if (loc) {
          setLocalizacaoAtual(loc.coords);

          // 2. Buscar bibliotecas próximas usando a localização obtida
          const libs = await buscarBibliotecasProximas(loc.coords.latitude, loc.coords.longitude);
          setBibliotecas(libs);
        } else {
          setErroMensagem('Não foi possível obter a localização atual.');
        }
      } catch (error) {
        console.error('Erro ao carregar dados do mapa:', error);
        setErroMensagem('Erro ao carregar dados do mapa. Verifique as permissões de localização.');
      } finally {
        setCarregando(false);
      }
    };

    carregarDadosDoMapa();
  }, []);

  if (carregando) {
    return (
      <View style={estilos.centralizado}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={estilos.textoCarregando}>Carregando mapa e bibliotecas...</Text>
      </View>
    );
  }

  if (erroMensagem) {
    return (
      <View style={estilos.centralizado}>
        <Text style={estilos.textoErro}>{erroMensagem}</Text>
      </View>
    );
  }

  return (
    <View style={estilos.container}>
      {localizacaoAtual && (
        <MapView
          style={estilos.mapa}
          initialRegion={{
            latitude: localizacaoAtual.latitude,
            longitude: localizacaoAtual.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true} // Mostra a bolinha azul da localização do usuário
          followsUserLocation={true}
        >
          {bibliotecas.map(biblioteca => (
            <Marker
              key={biblioteca.id}
              coordinate={{
                latitude: biblioteca.latitude,
                longitude: biblioteca.longitude,
              }}
              title={biblioteca.nome}
              description={`${biblioteca.endereco} (${biblioteca.distancia} km)`}
            >
              <MaterialIcons name="local-library" size={30} color={Colors.secondary} />
            </Marker>
          ))}
        </MapView>
      )}

      <View style={estilos.listaBibliotecas}>
        <Text style={estilos.tituloLista}>Bibliotecas Próximas</Text>
        {bibliotecas.length === 0 ? (
          <Text style={estilos.textoVazio}>Nenhuma biblioteca encontrada nas proximidades.</Text>
        ) : (
          <FlatList
            data={bibliotecas}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={estilos.cardBiblioteca}>
                <Text style={estilos.nomeBiblioteca}>{item.nome}</Text>
                <Text style={estilos.detalheBiblioteca}>{item.endereco}</Text>
                <Text style={estilos.detalheBiblioteca}>Horário: {item.horarioFuncionamento}</Text>
                <Text style={estilos.detalheBiblioteca}>Distância: {item.distancia} km</Text>
                <TouchableOpacity
                  style={estilos.botaoRotas}
                  onPress={() => abrirRotasNoGPS(item.latitude, item.longitude, item.nome)}
                >
                  <Text style={estilos.textoBotaoRotas}>Obter Rotas</Text>
                  <MaterialIcons name="directions" size={20} color={Colors.white} style={estilos.iconeBotaoRotas} />
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  textoCarregando: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.mediumGray,
  },
  textoErro: {
    color: Colors.error,
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  mapa: {
    flex: 2,
    width: '100%',
  },
  listaBibliotecas: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20, // Sobrepõe um pouco o mapa
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  tituloLista: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  cardBiblioteca: {
    backgroundColor: Colors.background,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  nomeBiblioteca: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 5,
  },
  detalheBiblioteca: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 3,
  },
  botaoRotas: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
    paddingVertical: 8,
    borderRadius: 5,
    marginTop: 10,
  },
  textoBotaoRotas: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  iconeBotaoRotas: {
    marginLeft: 5,
  },
  textoVazio: {
    textAlign: 'center',
    color: Colors.mediumGray,
    marginTop: 10,
  },
});

