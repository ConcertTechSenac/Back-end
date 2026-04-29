import axios from 'axios';

const api = axios.create({
  // Use seu IP local. localhost não funciona no celular/emulador para o back-end
  baseURL: 'http://192.168.1.5:3000/api', 
});

export default api;