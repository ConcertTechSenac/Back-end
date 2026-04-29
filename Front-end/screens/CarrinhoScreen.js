import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  SafeAreaView,
} from "react-native";
import COLORS from "../constants/colors";
import BotaoVoltar from "../components/BotaoVoltar";

export default function CarrinhoScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header branco */}
      <View style={styles.topoBranco}>
        <View style={styles.header}>
          <View style={styles.colunaEsquerda}>
            <TouchableOpacity onPress={() => navigation.openDrawer?.() || navigation.goBack()}>
              <Image
                source={require("../assets/menu.png")}
                style={styles.iconeMenu}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.colunaCentral}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate("Home")}
            >
              <Image
                source={require("../assets/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.colunaDireita}>
            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.8}>
              <Image
                source={require("../assets/acessibilidade.png")}
                style={styles.iconePadrao}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.iconBtn} 
              activeOpacity={0.8}
              onPress={() => navigation.navigate("Carrinho")}
            >
              <Image
                source={require("../assets/carrinho.png")}
                style={styles.iconePadrao}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Faixa azul centralizada com Logo */}
      <View style={styles.faixaAzul}>
        <View style={styles.containerBotaoVoltar}>
           <BotaoVoltar navigation={navigation} />
        </View>

        <TouchableOpacity 
          activeOpacity={0.7} 
          onPress={() => navigation.goBack()}
          style={styles.containerLogoFaixa}
        >
          <Image
            source={require("../assets/logo.png")}
            style={styles.logoFaixa}
            resizeMode="contain"
          />
        </TouchableOpacity>
        
        <View style={styles.placeholderDireita} />
      </View>

      {/* Conteúdo */}
      <View style={styles.container}>
        <View style={styles.blocoSuperior}>
          <Text style={styles.tituloSecao}>Descrição do Produto</Text>
          {/* Aqui você pode mapear os itens do carrinho futuramente */}
        </View>

        <View style={styles.divisor} />

        <View style={styles.blocoInferior}>
          <Text style={styles.tituloSecao}>Resumo da compra</Text>

          <View style={styles.linhaResumo} />

          <Text style={styles.totalTexto}>Total: R$ 0,00</Text>

          <TouchableOpacity style={styles.botaoContinuar} activeOpacity={0.8}>
            <Text style={styles.botaoContinuarTexto}>CONTINUAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  topoBranco: {
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
  },
  colunaEsquerda: {
    flex: 1,
    alignItems: "flex-start",
  },
  colunaCentral: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  colunaDireita: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  iconeMenu: {
    width: 24,
    height: 24,
  },
  iconePadrao: {
    width: 22,
    height: 22,
  },
  iconBtn: {
    marginLeft: 14,
  },
  logo: {
    width: 150,
    height: 40,
  },
  faixaAzul: {
    height: 72,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  containerBotaoVoltar: {
    flex: 1,
    alignItems: 'flex-start',
  },
  containerLogoFaixa: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderDireita: {
    flex: 1,
  },
  logoFaixa: {
    width: 100,
    height: 35,
  },
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  blocoSuperior: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  blocoInferior: {
    height: 210,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    justifyContent: "space-between",
  },
  divisor: {
    height: 1,
    backgroundColor: "#bdbdbd",
  },
  tituloSecao: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  linhaResumo: {
    height: 1,
    backgroundColor: "#9e9e9e",
    marginTop: 18,
    marginBottom: 10,
  },
  totalTexto: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginTop: 8,
  },
  botaoContinuar: {
    backgroundColor: "#2f80ed",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    borderRadius: 4,
  },
  botaoContinuarTexto: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});