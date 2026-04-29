import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Image, KeyboardAvoidingView, Platform, ScrollView, 
  TouchableWithoutFeedback, Keyboard, Alert, ActivityIndicator 
} from 'react-native';
import { cadastrarUsuario } from '../services/authService';

const COLORS = { darkBlue: '#282b75', cyan: '#00aeee', white: '#ffffff' };

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCadastro = async () => {
    // Validações locais rápidas
    if (!nome || !email || !telefone || !senha || !confirmarSenha) {
      Alert.alert("Erro", "Todos os campos são obrigatórios!");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem!");
      return;
    }

    if (senha.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const resultado = await cadastrarUsuario(nome, email, senha, telefone);

      if (resultado.success) {
        Alert.alert("Sucesso", resultado.message);
        // Navega para verificação passando o email para facilitar o próximo passo
        navigation.navigate('Verificacao', { email: email });
      }
    } catch (error) {
      Alert.alert("Erro no Cadastro", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <View style={styles.headerAzul} /> 
          
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Image 
              source={require('../assets/logo.png')} 
              style={styles.logo} 
              resizeMode="contain" 
            />
            
            <Text style={styles.titulo}>Crie sua conta</Text>
            
            <TextInput 
              style={styles.input} 
              placeholder="Nome Completo" 
              value={nome} 
              onChangeText={setNome}
              editable={!loading}
            />

            <TextInput 
              style={styles.input} 
              placeholder="E-mail" 
              value={email} 
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />

            <TextInput 
              style={styles.input} 
              placeholder="Telefone" 
              value={telefone} 
              onChangeText={setTelefone}
              keyboardType="phone-pad"
              editable={!loading}
            />
            
            <TextInput 
              style={styles.input} 
              placeholder="Senha" 
              secureTextEntry 
              value={senha} 
              onChangeText={setSenha}
              editable={!loading}
            />

            <TextInput 
              style={styles.input} 
              placeholder="Confirmar Senha" 
              secureTextEntry 
              value={confirmarSenha} 
              onChangeText={setConfirmarSenha}
              editable={!loading}
            />

            <TouchableOpacity 
              style={[styles.botaoPrincipal, loading && { opacity: 0.7 }]} 
              onPress={handleCadastro}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.botaoTextoPrincipal}>CADASTRAR</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.botaoSecundario} 
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={styles.botaoTextoSecundario}>JÁ TENHO CONTA (VOLTAR)</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  innerContainer: { flex: 1 },
  headerAzul: { height: 60, backgroundColor: COLORS.darkBlue },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 30 },
  logo: { width: 160, height: 50, alignSelf: 'center', marginBottom: 20 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: COLORS.darkBlue, marginBottom: 25, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, marginBottom: 15, color: '#333' },
  botaoPrincipal: { backgroundColor: COLORS.darkBlue, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10, height: 55, justifyContent: 'center' },
  botaoTextoPrincipal: { color: COLORS.white, fontWeight: 'bold' },
  botaoSecundario: { borderWidth: 1, borderColor: COLORS.cyan, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 15 },
  botaoTextoSecundario: { color: COLORS.cyan, fontWeight: 'bold' }
});