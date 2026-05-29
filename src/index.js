// src/index.js
require("dotenv").config();
const express = require("express");
const authRoutes    = require("./routes/authRoutes");
const chatRoutes    = require("./routes/Chatroutes");
const produtoRoutes = require("./routes/produtoRoutes");

const app = express();

app.use(express.json({ limit: '5mb' }));

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ message: "API Hard Tech rodando!" });
});

// Rotas de autenticação
app.use("/api/auth", authRoutes);

// Rotas do chatbot
app.use("/api", chatRoutes);

// Rotas de produtos
app.use("/api/produtos", produtoRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor na porta ${PORT}`);
});
