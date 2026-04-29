import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import COLORS from '../constants/colors';

export default function ProductCards({ produtos, onPress }) {
  // Se não houver produtos ainda (lista vazia), não renderiza nada ou poderia renderizar um Skeleton
  if (!produtos || produtos.length === 0) {
    return null; 
  }

  return (
    <View style={styles.section}>
      <View style={styles.row}>
        {produtos.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.card} 
            activeOpacity={0.8} 
            onPress={() => onPress(item)} // Passa o item clicado para a navegação
          >
            {/* Imagem do Produto */}
            <View style={styles.imageContainer}>
              {item.foto_perfil ? (
                <Image source={{ uri: item.foto_perfil }} style={styles.image} />
              ) : (
                <View style={styles.imagePlaceholder} />
              )}
            </View>

            {/* Informações do Produto */}
            <View style={styles.infoContainer}>
              <Text style={styles.nome} numberOfLines={1}>
                {item.nome}
              </Text>
              <Text style={styles.preco}>
                R$ {parseFloat(item.preco).toFixed(2).replace('.', ',')}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Permite que os cards quebrem linha se houver muitos
    gap: 12,
    justifyContent: 'flex-start',
  },
  card: {
    width: '30%', // Ajusta para caber 3 cards por linha aproximadamente
    aspectRatio: 0.65, // Aumentei um pouco para caber os textos abaixo da imagem
    backgroundColor: COLORS.white || '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 10,
  },
  imageContainer: {
    flex: 2,
    backgroundColor: COLORS.gray200 || '#eee',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: COLORS.gray200 || '#eee',
  },
  infoContainer: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
  },
  nome: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  preco: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.darkBlue || '#282b75',
  },
});