'use strict';
require('dotenv').config();

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATA_BASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ── SQL de criação automática da tabela ──────────────────────────────────────
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

// ── Inicialização: testa conexão e cria tabela se não existir ────────────────
const inicializarBanco = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('✅ Conectado ao banco de dados com sucesso!');

    await connection.query(CREATE_TABLE_USUARIOS);
    console.log('✅ Tabela "usuarios" verificada/criada com sucesso!');

  } catch (err) {
    console.error('❌ Erro ao inicializar o banco de dados:', err.message);
    // Encerra o processo se não conseguir conectar — evita servidor zumbi
    process.exit(1);
  } finally {
    if (connection) connection.release();
  }
};

inicializarBanco();

module.exports = pool;
