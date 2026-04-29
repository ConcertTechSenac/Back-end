require('dotenv').config();
const express = require('express');
const cors = require('cors'); // 1. Importe o pacote cors
const authRoutes = require('./routes/authRoutes');

const app = express();

// 2. Configure o CORS para aceitar conexões do seu Front-end
app.use(cors()); 

app.use(express.json()); 

const PORT = process.env.PORT || 3000; 

app.get('/', (req, res) => {
  res.json({ message: 'API rodando!' });
});

// Rotas de autenticação
app.use('/api/auth', authRoutes);

// Forçando o Node a escutar em todas as interfaces de rede
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});