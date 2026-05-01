require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json()); 

const PORT = process.env.PORT || 3000; 

app.get('/', (req, res) => {
  res.json({ message: 'API rodando!' });
});

// Rotas de autenticação
app.use('/api/auth', authRoutes);

// Forçando o Node a escutar em todas as interfaces de rede (IPv4 e IPv6)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor na porta ${PORT}`);
});