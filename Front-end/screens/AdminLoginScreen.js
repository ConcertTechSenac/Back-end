import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Image, Alert, KeyboardAvoidingView, Platform, ScrollView, 
  TouchableWithoutFeedback, Keyboard 
} from 'react-native';

const COLORS = { darkBlue: '#282b75', cyan: '#00aeee', white: '#ffffff' };

export default function AdminLoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleAdminLogin = () => {
    if (email.trim() === '' || senha.trim() === '') {
      Alert.alert('Atenção', 'Preencha o e-mail e a senha para testar o acesso.');
      return;
    }
    
    // Navega para a tela real de produtos após o "login"
    navigation.navigate('AdminProdutos');
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
            
            <Text style={styles.titulo}>Área do Administrador</Text>
            
            <TextInput 
              style={styles.input} 
              placeholder="E-mail Admin" 
              value={email} 
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            
            <TextInput 
              style={styles.input} 
              placeholder="Senha" 
              secureTextEntry 
              value={senha} 
              onChangeText={setSenha}
            />

            <TouchableOpacity style={styles.botaoPrincipal} onPress={handleAdminLogin}>
              <Text style={styles.botaoTextoPrincipal}>ENTRAR</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoSecundario} onPress={() => navigation.goBack()}>
              <Text style={styles.botaoTextoSecundario}>VOLTAR PARA LOGIN NORMAL</Text>
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
  logo: { width: 180, height: 150, alignSelf: 'center', marginBottom: 20 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: COLORS.darkBlue, marginBottom: 30, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, marginBottom: 15 },
  botaoPrincipal: { backgroundColor: COLORS.darkBlue, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  botaoTextoPrincipal: { color: COLORS.white, fontWeight: 'bold' },
  botaoSecundario: { borderWidth: 1, borderColor: COLORS.cyan, padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 15 },
  botaoTextoSecundario: { color: COLORS.cyan, fontWeight: 'bold' }
});