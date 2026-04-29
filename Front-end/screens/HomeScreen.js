import React, { useState, useEffect } from "react";
import {
  View, ScrollView, StatusBar, StyleSheet,
  Modal, TouchableOpacity, ActivityIndicator, Alert
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import COLORS from "../constants/colors";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import AdCarousel from "../components/AdCarousel";
import ProductCards from "../components/ProductCards";
import Categories from "../components/Categories";
import MenuLateral from "../components/MenuLateral";
import BarraNavegacao from "../components/BarraNavegacao";

// Importe a sua instância da API
import api from "../services/api"; 

export default function HomeScreen({ navigation }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Função para buscar os produtos do Back-end
  const buscarProdutos = async () => {
    try {
      setCarregando(true);
      // Rota que você deve ter no seu back-end (ex: /api/produtos)
      const response = await api.get("/produtos"); 
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      Alert.alert("Erro", "Não foi possível carregar os produtos.");
    } finally {
      setCarregando(false);
    }
  };

  // Executa ao montar a tela
  useEffect(() => {
    buscarProdutos();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

        <Header navigation={navigation} onMenuPress={() => setMenuAberto(true)} />

        {carregando ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary || "#282b75"} />
          </View>
        ) : (
          <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <SearchBar />
            <AdCarousel />
            
            {/* Passamos os produtos vindos do banco para o componente de Cards */}
            <ProductCards 
              produtos={produtos} 
              onPress={() => navigation.navigate('MaisVendidos')} 
            />
            
            <Categories onPress={() => navigation.navigate('MaisVendidos')} />
          </ScrollView>
        )}

        <BarraNavegacao navigation={navigation} telaAtiva="Home" />

        <Modal
          visible={menuAberto}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setMenuAberto(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity 
              style={styles.overlayFundo} 
              activeOpacity={1} 
              onPress={() => setMenuAberto(false)} 
            />
            <View style={styles.menuContainer}>
              <MenuLateral onClose={() => setMenuAberto(false)} navigation={navigation} />
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scroll: {
    flex: 1,
    backgroundColor: COLORS.background || "#f5f5f5",
  },
  scrollContent: {
    paddingBottom: 80, // Espaço extra para não cobrir o conteúdo com a barra de navegação
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  overlayFundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuContainer: {
    width: '80%',
    backgroundColor: COLORS.white,
    height: '100%',
    position: 'absolute',
    left: 0,
  },
});