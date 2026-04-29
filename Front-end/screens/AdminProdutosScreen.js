import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, 
  Modal, TextInput, Alert, ActivityIndicator, Platform,
  ScrollView, KeyboardAvoidingView 
} from 'react-native';

const COLORS = { 
  darkBlue: '#282b75', cyan: '#00aeee', white: '#ffffff',
  green: '#28a745', yellow: '#ffc107', red: '#dc3545', blueAction: '#007bff'
};

export default function AdminProdutosScreen({ navigation }) {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [acaoAtual, setAcaoAtual] = useState(''); 

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [imagemPrincipal, setImagemPrincipal] = useState('');

  const carregarProdutos = async () => {
    setLoading(true);
    try {
      setProdutos([]); // Pronto para receber dados do back
    } catch (error) {
      Alert.alert('Erro', 'Falha ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregarProdutos(); }, []);

  const abrirFormulario = (acao) => {
    if (acao !== 'adicionar' && !produtoSelecionado) {
      Alert.alert('Atenção', 'Selecione um produto na lista primeiro.');
      return;
    }

    setAcaoAtual(acao);

    if (acao === 'adicionar') {
      limparCampos();
    } else {
      setNome(produtoSelecionado.nome);
      setDescricao(produtoSelecionado.descricao);
      setPreco(produtoSelecionado.preco.toString());
      setEstoque(produtoSelecionado.estoque.toString());
      setCategoriaId(produtoSelecionado.categoria_id.toString());
      setImagemPrincipal(produtoSelecionado.imagem_principal);
    }
    setModalVisible(true);
  };

  const limparCampos = () => {
    setNome(''); setDescricao(''); setPreco(''); 
    setEstoque(''); setCategoriaId(''); setImagemPrincipal('');
  };

  const confirmarOperacao = async () => {
    Alert.alert('Sucesso', `Operação ${acaoAtual} realizada com sucesso!`);
    setModalVisible(false);
    setProdutoSelecionado(null);
    carregarProdutos();
  };

  const renderProduto = ({ item }) => (
    <TouchableOpacity 
      style={[styles.card, produtoSelecionado?.id === item.id && styles.cardSelecionado]}
      onPress={() => setProdutoSelecionado(produtoSelecionado?.id === item.id ? null : item)}
    >
      <Text style={styles.cardNome}>{item.nome}</Text>
      <Text style={styles.cardInfo}>Estoque: {item.estoque} | Preço: R$ {item.preco}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.btnVoltar} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.txtBtnVoltar}>◀ Sair</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>Gerenciar Produtos</Text>
        <View style={{ width: 60 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.darkBlue} style={{marginTop: 50}} />
      ) : (
        <FlatList
          data={produtos}
          keyExtractor={item => item.id.toString()}
          renderItem={renderProduto}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          ListEmptyComponent={<Text style={styles.vazio}>Nenhum produto encontrado no banco.</Text>}
        />
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.btnFooter, {backgroundColor: COLORS.green}]} onPress={() => abrirFormulario('adicionar')}>
          <Text style={styles.txtBtnFooter}>Adicionar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btnFooter, {backgroundColor: COLORS.yellow}]} onPress={() => abrirFormulario('editar')}>
          <Text style={[styles.txtBtnFooter, {color: '#000'}]}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btnFooter, {backgroundColor: COLORS.red}]} onPress={() => abrirFormulario('deletar')}>
          <Text style={styles.txtBtnFooter}>Deletar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btnFooter, {backgroundColor: COLORS.blueAction}]} onPress={() => abrirFormulario('visualizar')}>
          <Text style={styles.txtBtnFooter}>Visualizar</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>{acaoAtual.toUpperCase()}</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {(acaoAtual === 'adicionar' || acaoAtual === 'editar' || acaoAtual === 'visualizar') && (
                <View>
                  <Text style={styles.label}>Nome do Produto</Text>
                  <TextInput style={styles.input} value={nome} onChangeText={setNome} editable={acaoAtual !== 'visualizar'} />
                  
                  <Text style={styles.label}>Descrição</Text>
                  <TextInput style={[styles.input, {height: 60}]} value={descricao} onChangeText={setDescricao} multiline editable={acaoAtual !== 'visualizar'} />
                  
                  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{width: '48%'}}>
                      <Text style={styles.label}>Preço (R$)</Text>
                      <TextInput style={styles.input} value={preco} onChangeText={setPreco} keyboardType="numeric" editable={acaoAtual !== 'visualizar'} />
                    </View>
                    <View style={{width: '48%'}}>
                      <Text style={styles.label}>Estoque Qtd</Text>
                      <TextInput style={styles.input} value={estoque} onChangeText={setEstoque} keyboardType="numeric" editable={acaoAtual !== 'visualizar'} />
                    </View>
                  </View>

                  <Text style={styles.label}>ID da Categoria</Text>
                  <TextInput style={styles.input} value={categoriaId} onChangeText={setCategoriaId} keyboardType="numeric" editable={acaoAtual !== 'visualizar'} />
                  
                  <Text style={styles.label}>URL da Imagem Principal</Text>
                  <TextInput style={styles.input} value={imagemPrincipal} onChangeText={setImagemPrincipal} editable={acaoAtual !== 'visualizar'} />
                </View>
              )}

              {acaoAtual === 'deletar' && (
                <Text style={styles.confirmacaoTxt}>Deseja excluir permanentemente o produto: {"\n\n"}{produtoSelecionado?.nome}?</Text>
              )}
            </ScrollView>

            <View style={styles.modalAcoes}>
              <TouchableOpacity style={[styles.btnModal, {backgroundColor: '#999'}]} onPress={() => setModalVisible(false)}>
                <Text style={styles.txtBtn}>Fechar</Text>
              </TouchableOpacity>
              
              {acaoAtual !== 'visualizar' && (
                <TouchableOpacity 
                  style={[styles.btnModal, {backgroundColor: acaoAtual === 'deletar' ? COLORS.red : COLORS.darkBlue}]} 
                  onPress={confirmarOperacao}
                >
                  <Text style={styles.txtBtn}>Confirmar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { 
    height: Platform.OS === 'ios' ? 100 : 90, 
    backgroundColor: COLORS.darkBlue, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-end', 
    paddingBottom: 15,
    paddingHorizontal: 15 
  },
  headerTitulo: { color: '#fff', fontSize: 18, fontWeight: 'bold', paddingBottom: 2 },
  btnVoltar: { width: 60, paddingBottom: 2 },
  txtBtnVoltar: { color: COLORS.cyan, fontSize: 16, fontWeight: 'bold' },
  card: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: '#fff' },
  cardSelecionado: { backgroundColor: '#eef8ff', borderLeftWidth: 5, borderLeftColor: COLORS.cyan },
  cardNome: { fontSize: 16, fontWeight: 'bold', color: COLORS.darkBlue },
  cardInfo: { fontSize: 13, color: '#666', marginTop: 4 },
  vazio: { textAlign: 'center', marginTop: 50, color: '#999' },
  footer: { flexDirection: 'row', height: 70, position: 'absolute', bottom: 0, width: '100%' },
  btnFooter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  txtBtnFooter: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 20, maxHeight: '80%' },
  modalTitulo: { fontSize: 18, fontWeight: 'bold', color: COLORS.darkBlue, textAlign: 'center', marginBottom: 20 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#555', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 10, marginBottom: 15, color: '#333' },
  confirmacaoTxt: { textAlign: 'center', fontSize: 16, marginVertical: 20 },
  modalAcoes: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  btnModal: { flex: 0.48, padding: 15, borderRadius: 8, alignItems: 'center' },
  txtBtn: { color: '#fff', fontWeight: 'bold' }
});