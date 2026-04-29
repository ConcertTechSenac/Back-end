import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import COLORS from '../constants/colors';

/**
 * BotaoVoltar — componente reutilizável de navegação
 *
 * Props:
 *  - navigation (obrigatório): objeto de navegação do React Navigation
 *  - label (opcional): texto exibido ao lado da seta. Padrão: "Voltar"
 *  - style (opcional): estilo extra para o container
 *  - cor (opcional): cor da seta e do texto. Padrão: COLORS.white
 */
export default function BotaoVoltar({ navigation, label = 'Voltar', style, cor }) {
  const corTexto = cor || COLORS.white;

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => navigation.goBack()}
      activeOpacity={0.7}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Text style={[styles.seta, { color: corTexto }]}>←</Text>
      <Text style={[styles.label, { color: corTexto }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingRight: 12,
  },
  seta: {
    fontSize: 20,
    marginRight: 6,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
});
