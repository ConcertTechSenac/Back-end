import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  TouchableWithoutFeedback, 
  Keyboard,
  Alert,
  ActivityIndicator
} from 'react-native';

// Importe o serviço de autenticação que criamos
import { loginUsuario } from '../services/authService';

const COLORS = { 
  darkBlue: '#282b75', 
  cyan: '#00aeee', 
  white: '#ffffff',
  gray: '#ddd',
  lightGray: '#eee'
};

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Validação básica local
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);

    try {
      // Chamada para o Back-end
      const dados = await loginUsuario(email, senha);

      if (dados.success) {
        // Se o login for bem-sucedido
        Alert.alert('Sucesso', `Bem-vindo, ${dados.user.nome}!`);
        
        // Aqui você pode salvar o token no AsyncStorage no futuro
        // console.log('Token recebido:', dados.token);

        navigation.navigate('Home');
      }
    } catch (error) {
      // O 'error' aqui é a string que retornamos no catch do authService
      Alert.alert('Erro no Login', error);
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
          
          <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
          >
            {/* Logo do App */}
            <Image 
              source={require('../assets/logo.png')} 
              style={styles.logo} 
              resizeMode="contain" 
            />
            
            <Text style={styles.titulo}>Bem-vindo!</Text>
            
            <TextInput 
              style={styles.input} 
              placeholder="E-mail" 
              value={email} 
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
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

            {/* Botão Principal de Login */}
            <TouchableOpacity 
              style={[styles.botaoPrincipal, loading && { opacity: 0.7 }]} 
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.botaoTextoPrincipal}>ENTRAR</Text>
              )}
            </TouchableOpacity>

            {/* Botão Secundário para Cadastro */}
            <TouchableOpacity 
              style={styles.botaoSecundario} 
              onPress={() => navigation.navigate('Cadastro')}
              disabled={loading}
            >
              <Text style={styles.botaoTextoSecundario}>CADASTRAR-SE</Text>
            </TouchableOpacity>

            <View style={styles.separador} />

            {/* Botão de Administrador */}
            <TouchableOpacity 
              style={styles.botaoSecundario} 
              onPress={() => navigation.navigate('AdminLogin')}
              disabled={loading}
            >
              <Text style={styles.botaoTextoSecundario}>LOGIN COMO ADMINISTRADOR</Text>
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
  
  logo: { width: 180, height: 60, alignSelf: 'center', marginBottom: 20 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: COLORS.darkBlue, marginBottom: 30, textAlign: 'center' },
  input: { 
    borderWidth: 1, 
    borderColor: COLORS.gray, 
    borderRadius: 8, 
    padding: 15, 
    marginBottom: 15, 
    color: '#333' 
  },
  
  botaoPrincipal: { 
    backgroundColor: COLORS.darkBlue, 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 10,
    height: 55, // Altura fixa para não "pular" quando o loading aparecer
    justifyContent: 'center'
  },
  botaoTextoPrincipal: { color: COLORS.white, fontWeight: 'bold' },
  
  botaoSecundario: { 
    borderWidth: 1, 
    borderColor: COLORS.cyan, 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 15 
  },
  botaoTextoSecundario: { color: COLORS.cyan, fontWeight: 'bold' },

  separador: { height: 1, backgroundColor: COLORS.lightGray, marginVertical: 20 }
});