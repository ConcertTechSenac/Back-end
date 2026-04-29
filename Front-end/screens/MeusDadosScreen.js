import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar,
  Image, SafeAreaView, TextInput, ScrollView, ActivityIndicator, Alert
} from "react-native";
import COLORS from "../constants/colors";
import BotaoVoltar from "../components/BotaoVoltar";
import api from "../services/api"; // Sua instância do Axios

export default function MeusDadosScreen({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState(""); // Adicionado conforme seu Model
  const [editando, setEditando] = useState(false);
  const [carregando, setCarregando] = useState(true);

  // 1. Busca os dados do usuário ao abrir a tela
  const carregarPerfil = async () => {
    try {
      setCarregando(true);
      // O token deve estar nos headers do axios (configurado no login)
      const response = await api.get("/auth/perfil"); 
      
      if (response.data.success) {
        const { usuario } = response.data;
        setNome(usuario.nome);
        setEmail(usuario.email);
        setTelefone(usuario.telefone || "");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar seus dados.");
      console.log(error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarPerfil();
  }, []);

  // 2. Função para salvar as alterações (PUT)
  const handleSalvar = async () => {
    if (!editando) {
      setEditando(true);
      return;
    }

    try {
      setCarregando(true);
      const response = await api.put("/auth/perfil", {
        nome,
        telefone
      });

      if (response.data.success) {
        Alert.alert("Sucesso", "Dados atualizados!");
        setEditando(false);
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao atualizar dados.");
    } finally {
      setCarregando(false);
    }
  };

  if (carregando && !editando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header mantido igual ao seu */}
      <View style={styles.topoBranco}>
        <View style={styles.header}>
          <View style={styles.colunaEsquerda}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={require("../assets/menu.png")} style={styles.iconeMenu} />
            </TouchableOpacity>
          </View>
          <View style={styles.colunaCentral}>
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
              <Image source={require("../assets/logo.png")} style={styles.logo} resizeMode="contain" />
            </TouchableOpacity>
          </View>
          <View style={styles.colunaDireita}>
             <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate("Carrinho")}>
              <Image source={require("../assets/carrinho.png")} style={styles.iconePadrao} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.faixaAzul}>
        <BotaoVoltar navigation={navigation} />
        <Text style={styles.tituloTela}>Meus Dados</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.tituloSecao}>Dados Pessoais</Text>

          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={[styles.input, !editando && styles.inputInativo]}
            value={nome}
            editable={editando}
            onChangeText={setNome}
          />

          <Text style={styles.label}>Email (Não alterável)</Text>
          <TextInput
            style={[styles.input, styles.inputInativo]}
            value={email}
            editable={false}
          />

          <Text style={styles.label}>Telefone</Text> 
          <TextInput
            style={[styles.input, !editando && styles.inputInativo]}
            value={telefone}
            editable={editando}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
          />

          <TouchableOpacity
            style={[styles.botaoEditar, editando ? {backgroundColor: '#28a745'} : {}]}
            onPress={handleSalvar}
          >
            {carregando ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.botaoTexto}>
                {editando ? "SALVAR ALTERAÇÕES" : "EDITAR DADOS"}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Card de Histórico (Pode ser alimentado por uma nova rota futuramente) */}
        <View style={styles.card}>
          <Text style={styles.tituloSecao}>Histórico de Pedidos</Text>
          <Text style={{textAlign: 'center', color: '#999', marginTop: 10}}>
            Você ainda não possui pedidos finalizados.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... Seus estilos existentes ...
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  topoBranco: { backgroundColor: COLORS.white },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 10 },
  colunaEsquerda: { flex: 1 },
  colunaCentral: { flex: 2, alignItems: "center" },
  colunaDireita: { flex: 1, flexDirection: "row", justifyContent: "flex-end" },
  logo: { width: 150, height: 40 },
  iconeMenu: { width: 24, height: 24 },
  iconePadrao: { width: 22, height: 22 },
  iconBtn: { marginLeft: 14 },
  faixaAzul: { height: 60, backgroundColor: COLORS.primary, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12 },
  tituloTela: { color: COLORS.white, fontSize: 18, fontWeight: "700" },
  container: { backgroundColor: "#f2f2f2" },
  card: { backgroundColor: COLORS.white, margin: 12, padding: 16, borderRadius: 8, elevation: 2 },
  tituloSecao: { fontSize: 16, fontWeight: "800", marginBottom: 12, color: COLORS.primary },
  label: { fontSize: 13, marginTop: 10, color: "#555" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 10, marginTop: 5, color: "#333" },
  inputInativo: { backgroundColor: "#f9f9f9", color: "#888" },
  botaoEditar: { backgroundColor: COLORS.primary, marginTop: 20, padding: 15, alignItems: "center", borderRadius: 6 },
  botaoTexto: { color: COLORS.white, fontWeight: "700" },
  pedidoItem: { borderBottomWidth: 1, borderBottomColor: "#ddd", paddingVertical: 12 },
  pedidoTexto: { fontSize: 14, fontWeight: "600" },
  pedidoValor: { fontSize: 13, color: "#555", marginTop: 4 },
});