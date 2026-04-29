import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Image, TextInput, Alert
} from 'react-native';

const COLORS = {
  darkBlue: '#282b75',
  cyan: '#00aeee',
  white: '#ffffff',
};

export default function MenuLateral({ onClose, navigation, user }) {
  const [computadoresAberto, setComputadoresAberto] = useState(false);
  const [notebooksAberto, setNotebooksAberto] = useState(false);
  const [busca, setBusca] = useState('');

  const navegarPara = (tela) => {
    onClose();
    navigation.navigate(tela);
  };

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja realmente sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Sair", 
        onPress: () => {
          onClose();
          navigation.replace('Login'); // Use replace para ele não conseguir "voltar" para a Home logado
        } 
      }
    ]);
  };

  return (
    <View style={styles.container}>

      {/* Header Azul com Identificação do Usuário */}
      <View style={styles.header}>
        <Image source={require('../assets/adicionar.png')} style={styles.avatarIcon} />
        <View>
          <Text style={styles.saudacao}>Olá,</Text>
          <Text style={styles.userName}>{user?.nome || 'Visitante'}</Text>
        </View>
      </View>

      {/* Barra de busca */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Image source={require('../assets/lupa.png')} style={styles.iconeLupa} resizeMode="contain" />
          <TextInput
            style={styles.searchInput}
            placeholder="Busque no HARD!"
            placeholderTextColor="#a0a0cc"
            value={busca}
            onChangeText={setBusca}
          />
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* GRUPO 1 */}
        <TouchableOpacity style={styles.item} onPress={() => navegarPara('MeusDados')}>
          <Image source={require('../assets/adicionar.png')} style={styles.iconeMenu} resizeMode="contain" />
          <Text style={styles.itemTexto}>Meus Dados</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => navegarPara('MeusPedidos')}>
          <Image source={require('../assets/adicionar.png')} style={styles.iconeMenu} resizeMode="contain" />
          <Text style={styles.itemTexto}>Meus Pedidos</Text>
        </TouchableOpacity>

        {/* LINHA SEPARADORA */}
        <View style={styles.separador} />

        {/* GRUPO 2 - Categorias */}
        <TouchableOpacity style={styles.item} onPress={() => setComputadoresAberto(!computadoresAberto)}>
          <Image source={require('../assets/computador.png')} style={styles.iconeMenu} resizeMode="contain" />
          <Text style={styles.itemTextoBold}>Computadores:</Text>
          <Text style={styles.seta}>{computadoresAberto ? ' ∧' : ' ∨'}</Text>
        </TouchableOpacity>
        
        {computadoresAberto && (
          <View style={styles.submenu}>
            <TouchableOpacity style={styles.subItem} onPress={() => navegarPara('Categorias')}>
               <Text style={styles.subItemTexto}>PCs Gamer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.subItem}>
               <Text style={[styles.subItemTexto, styles.inativo]}>PCs para Uso Diário</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.item} onPress={() => setNotebooksAberto(!notebooksAberto)}>
          <Image source={require('../assets/notebook.png')} style={styles.iconeMenu} resizeMode="contain" />
          <Text style={styles.itemTextoBold}>Notebooks:</Text>
          <Text style={styles.seta}>{notebooksAberto ? ' ∧' : ' ∨'}</Text>
        </TouchableOpacity>

        {/* LINHA SEPARADORA */}
        <View style={styles.separador} />

        {/* BOTÃO DE SAIR */}
        <TouchableOpacity style={styles.item} onPress={handleLogout}>
          <Image 
            source={require('../assets/acessibilidade.png')} 
            style={[styles.iconeMenu, { tintColor: '#ff4444' }]} 
            resizeMode="contain" 
          />
          <Text style={[styles.itemTexto, { color: '#ff4444' }]}>Sair da Conta</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.darkBlue },
  header: {
    height: 100, 
    backgroundColor: COLORS.darkBlue,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)'
  },
  avatarIcon: { width: 40, height: 40, tintColor: COLORS.cyan, marginRight: 15 },
  saudacao: { color: COLORS.white, fontSize: 14, opacity: 0.8 },
  userName: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  
  searchContainer: { paddingHorizontal: 12, paddingVertical: 15 },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.cyan, borderRadius: 6, paddingHorizontal: 10, height: 40 },
  iconeLupa: { width: 16, height: 16, tintColor: COLORS.white },
  searchInput: { flex: 1, marginLeft: 8, color: COLORS.white, fontSize: 14 },
  
  scroll: { flex: 1 },
  separador: {
    height: 1,
    backgroundColor: COLORS.cyan,
    marginHorizontal: 16,
    marginVertical: 10,
    opacity: 0.3
  },
  item: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  iconeMenu: { width: 22, height: 22, marginRight: 12, tintColor: COLORS.white },
  itemTexto: { color: COLORS.white, fontSize: 15, fontWeight: '400' },
  itemTextoBold: { color: COLORS.white, fontSize: 15, fontWeight: '700' },
  inativo: { opacity: 0.45 },
  seta: { color: COLORS.cyan, fontSize: 14, fontWeight: 'bold', marginLeft: 'auto' },
  submenu: { backgroundColor: 'rgba(0,0,0,0.15)', paddingLeft: 50 },
  subItem: { paddingVertical: 12 },
  subItemTexto: { color: COLORS.white, fontSize: 14, fontWeight: '300' },
});