import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  SafeAreaVziew,
  Alert,
} from 'react-native';
import COLORS from '../constants/colors';
import BotaoVoltar from '../components/BotaoVoltar';

export default function VerificacaoScreen({ navigation }) {
  const [code, setCode] = useState(['', '', '', '']);
  const inputs = useRef([]);
  const [seconds, setSeconds] = useState(84);

  useEffect(() => {
    const timer =
      seconds > 0 && setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `00:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text !== '' && index < 3) {
      inputs.current[index + 1].focus();
    }

    const codigoCompleto = newCode.join('');
    if (codigoCompleto.length === 4) {
      setTimeout(() => {
        Alert.alert('Sucesso', 'E-mail confirmado com sucesso!');
        navigation.navigate('Login');
      }, 400);
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* ✅ BOTÃO VOLTAR no topo */}
      <View style={styles.topBar}>
        <BotaoVoltar navigation={navigation} cor={COLORS.primary} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          <Image
            source={require('../assets/chave.png')}
            style={styles.icon}
            resizeMode="contain"
          />

          <Text style={styles.title}>Informe o código</Text>

          <Text style={styles.subtitle}>
            Informe no campo abaixo o código recebido via {'\n'}
            <Text style={styles.bold}>e-mail</Text>
          </Text>

          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.codeInput}
                maxLength={1}
                keyboardType="number-pad"
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                value={digit}
                ref={(ref) => (inputs.current[index] = ref)}
                selectTextOnFocus
              />
            ))}
          </View>

          <Text style={styles.timerTitle}>Código irá expirar em</Text>
          <Text style={styles.timerValue}>{formatTime(seconds)}</Text>

          <TouchableOpacity
            style={[
              styles.reenviarButton,
              seconds === 0 && { backgroundColor: COLORS.primary },
            ]}
            disabled={seconds > 0}
            onPress={() => setSeconds(84)}
          >
            <Text
              style={[
                styles.reenviarText,
                seconds === 0 && { color: COLORS.white },
              ]}
            >
              Reenviar
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 30,
  },
  icon: {
    width: 70,
    height: 70,
    marginBottom: 20,
    tintColor: COLORS.primary,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A1C3D',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: 40,
  },
  bold: {
    fontWeight: 'bold',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginBottom: 40,
  },
  codeInput: {
    width: 60,
    height: 70,
    borderWidth: 1.5,
    borderColor: COLORS.gray200,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  timerTitle: {
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 5,
  },
  timerValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1C3D',
    marginBottom: 40,
  },
  reenviarButton: {
    width: '100%',
    height: 55,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reenviarText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.gray400,
  },
});
