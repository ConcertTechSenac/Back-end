import api from '../api/api';

export const loginUsuario = async (email, senha) => {
  try {
    const response = await api.post('/auth/login', { email, senha });
    return response.data;
  } catch (error) {
    // Retorna a mensagem de erro vinda do seu back-end (AuthController)
    throw error.response?.data?.erro || 'Erro ao conectar com o servidor';
  }
};

export const cadastrarUsuario = async (nome, email, senha, telefone) => {
  try {
    const response = await api.post('/auth/signup', { 
      nome, 
      email, 
      senha, 
      telefone 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.erro || 'Erro ao realizar cadastro';
  }
};