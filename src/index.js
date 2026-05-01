// src/index.js
require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ message: "API rodando!" });
});

// Rotas de autenticação
app.use("/api/auth", authRoutes);

// Rotas do chatbot
app.use("/api", chatRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor na porta ${PORT}`);
});
