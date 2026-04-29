import React from "react";
import { View, Image, StyleSheet, TouchableOpacity, Platform, StatusBar } from "react-native";
import COLORS from "../constants/colors";

export default function Header({ navigation, onMenuPress }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={onMenuPress}>
        <Image source={require("../assets/menu.png")} style={styles.icon} resizeMode="contain" />
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <Image source={require("../assets/logo.png")} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8}>
          <Image source={require("../assets/acessibilidade.png")} style={styles.icon} resizeMode="contain" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.headerIcon} activeOpacity={0.8} onPress={() => navigation.navigate("Carrinho")}>
          <Image source={require("../assets/carrinho.png")} style={styles.icon} resizeMode="contain" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 8 : 12,
    paddingBottom: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  headerIcon: { padding: 6 },
  headerRight: { flexDirection: "row", alignItems: "center" },
  logoContainer: { alignItems: "center", justifyContent: "center" },
  logo: { width: 110, height: 40 },
  icon: { width: 22, height: 22 },
});