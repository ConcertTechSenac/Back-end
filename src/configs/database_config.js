"use strict";
require("dotenv").config();

const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATA_BASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const CREATE_TABLE_USUARIOS = `
  CREATE TABLE IF NOT EXISTS usuarios (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    nome              VARCHAR(100)  NOT NULL,
    email             VARCHAR(150)  NOT NULL UNIQUE,
    senha             VARCHAR(255)  NOT NULL,
    telefone          VARCHAR(20)   DEFAULT NULL,
    foto_perfil       VARCHAR(255)  DEFAULT NULL,
    email_verificado  TINYINT(1)    NOT NULL DEFAULT 0,
    token_verificacao VARCHAR(10)   DEFAULT NULL,
    data_criacao      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                                    ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

const CREATE_TABLE_ADMINS = `
  CREATE TABLE IF NOT EXISTS admins (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    usuario   VARCHAR(100) NOT NULL UNIQUE,
    senha     VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

const inicializarBanco = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log("✅ Conectado ao banco de dados com sucesso!");

    // Cria tabela de usuários
    await connection.query(CREATE_TABLE_USUARIOS);
    console.log('✅ Tabela "usuarios" verificada/criada com sucesso!');

    // Cria tabela de admins
    await connection.query(CREATE_TABLE_ADMINS);
    console.log('✅ Tabela "admins" verificada/criada com sucesso!');

    // Verifica se o admin padrão já existe
    const [admins] = await connection.query(
      "SELECT id FROM admins WHERE usuario = ?",
      ["adm"],
    );

    if (admins.length === 0) {
      // Cria o admin padrão com usuário: adm / senha: adm
      const senhaHash = await bcrypt.hash("adm", 10);
      await connection.query(
        "INSERT INTO admins (usuario, senha) VALUES (?, ?)",
        ["adm", senhaHash],
      );
      console.log('✅ Admin padrão criado: usuário "adm" / senha "adm"');
    } else {
      console.log("✅ Admin padrão já existe.");
    }
  } catch (err) {
    console.error("❌ Erro ao inicializar o banco de dados:", err.message);
    process.exit(1);
  } finally {
    if (connection) connection.release();
  }
};

inicializarBanco();

module.exports = pool;
