import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importação das Telas de Usuário
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import CarrinhoScreen from './screens/CarrinhoScreen';
import CadastroScreen from './screens/CadastroScreen';
import VerificacaoScreen from './screens/VerificacaoScreen'; 
import MeusDadosScreen from './screens/MeusDadosScreen';
import AdminLoginScreen from './screens/AdminLoginScreen';
import AdminProdutosScreen from './screens/AdminProdutosScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        {/* Rotas de Usuário */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Carrinho" component={CarrinhoScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="Verificacao" component={VerificacaoScreen} />
        <Stack.Screen name="MeusDados" component={MeusDadosScreen} />
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
        <Stack.Screen name="AdminProdutos" component={AdminProdutosScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}