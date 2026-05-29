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

const CREATE_TABLE_PRODUTOS = `
  CREATE TABLE IF NOT EXISTS produtos (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    nome             VARCHAR(200)   NOT NULL,
    nome_short       VARCHAR(100)   DEFAULT NULL,
    descricao        TEXT           DEFAULT NULL,
    preco            DECIMAL(10,2)  NOT NULL,
    preco_original   DECIMAL(10,2)  DEFAULT NULL,
    categoria        VARCHAR(100)   NOT NULL,
    avaliacao        DECIMAL(3,1)   NOT NULL DEFAULT 5.0,
    avaliacoes       INT            NOT NULL DEFAULT 0,
    estoque          INT            NOT NULL DEFAULT 0,
    imagem           VARCHAR(500)   DEFAULT NULL,
    cor              VARCHAR(20)    NOT NULL DEFAULT '#282b75',
    destaque         TINYINT(1)     NOT NULL DEFAULT 0,
    data_criacao     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
                                    ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

// Produtos iniciais para seed
const SEED_PRODUTOS = [
  { nome: 'PC Gamer Pro', nome_short: 'PC Gamer Pro', descricao: 'Processador Intel Core i9-13900K de 13ª geração, 32GB RAM DDR5 5600MHz, placa NVIDIA RTX 4080 16GB GDDR6X, SSD NVMe 2TB. Gabinete full tower RGB com refrigeração líquida 360mm. Ideal para jogos AAA e edição profissional.', preco: 6499.99, preco_original: 7299.99, categoria: 'Computadores', avaliacao: 4.8, avaliacoes: 124, estoque: 8, imagem: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&q=80&auto=format&fit=crop', cor: '#1A2DA8', destaque: 1 },
  { nome: 'Notebook Ultra Slim 15"', nome_short: 'Notebook Ultra', descricao: 'AMD Ryzen 9 7940HS, tela OLED 15.6" 2.8K 120Hz, 16GB LPDDR5, SSD NVMe 1TB. Corpo alumínio de apenas 1.7kg, bateria 86Wh com até 12h de autonomia.', preco: 4299.99, preco_original: 4899.99, categoria: 'Notebooks', avaliacao: 4.6, avaliacoes: 87, estoque: 15, imagem: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80&auto=format&fit=crop', cor: '#0D47A1', destaque: 1 },
  { nome: 'Monitor 27" 144Hz QHD', nome_short: 'Monitor 27" 144Hz', descricao: 'Painel IPS QHD 2560×1440, 144Hz, 1ms MPRT. AMD FreeSync Premium e G-Sync Compatible. Ajuste de altura, inclinação e rotação. 2× HDMI 2.0 + 1× DisplayPort 1.4.', preco: 1399.99, preco_original: 1699.99, categoria: 'Periféricos', avaliacao: 4.7, avaliacoes: 203, estoque: 22, imagem: 'local://monitr_27_144hz.png', cor: '#004D40', destaque: 1 },
  { nome: 'Mouse Gamer RGB 16000 DPI', nome_short: 'Mouse Gamer RGB', descricao: 'Sensor óptico 16000 DPI com 6 níveis, 8 botões programáveis, iluminação RGB por zonas, polling rate 1000Hz, peso ajustável. Cabo trançado 1.8m.', preco: 229.99, preco_original: 299.99, categoria: 'Periféricos', avaliacao: 4.5, avaliacoes: 412, estoque: 47, imagem: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&q=80&auto=format&fit=crop', cor: '#B71C1C', destaque: 0 },
  { nome: 'SSD NVMe 1TB Gen4', nome_short: 'SSD NVMe 1TB', descricao: 'M.2 NVMe PCIe 4.0 x4 com leitura até 7000MB/s e escrita 6500MB/s. Fator M.2 2280, compatível com PS5 e PCs de alta performance. Inclui dissipador. Garantia 5 anos.', preco: 469.99, preco_original: 599.99, categoria: 'Componentes', avaliacao: 4.9, avaliacoes: 318, estoque: 34, imagem: 'local://ssd_nvme.jpg', cor: '#4A148C', destaque: 0 },
  { nome: 'Teclado Mecânico RGB TKL', nome_short: 'Teclado Mecânico', descricao: 'TKL com switches Cherry MX Red, iluminação RGB por tecla, corpo em alumínio escovado, teclas PBT doubleshot, conexão USB-C destacável. Anti-ghosting completo.', preco: 379.99, preco_original: 449.99, categoria: 'Periféricos', avaliacao: 4.7, avaliacoes: 156, estoque: 19, imagem: 'local://teclado_mecanico_rgb.jpeg', cor: '#1B5E20', destaque: 0 },
  { nome: 'PC Workstation i7', nome_short: 'Workstation i7', descricao: 'Intel Core i7-13700K, 32GB RAM DDR5, NVIDIA RTX 3060 12GB, SSD NVMe 1TB + HDD 2TB. Gabinete mid-tower silencioso. Ideal para criação de conteúdo, programação e multitarefa exigente.', preco: 4799.99, preco_original: 5299.99, categoria: 'Computadores', avaliacao: 4.6, avaliacoes: 78, estoque: 12, imagem: 'local://workstation_i7.jpg', cor: '#283593', destaque: 0 },
  { nome: 'Mini PC Office Pro', nome_short: 'Mini PC Office', descricao: 'Intel Core i5-1235U, 16GB RAM LPDDR4X, SSD 512GB. Formato compacto USFF, consumo de apenas 15W. Quatro saídas de vídeo simultâneas. Perfeito para escritório e home office.', preco: 1799.99, preco_original: 2099.99, categoria: 'Computadores', avaliacao: 4.4, avaliacoes: 55, estoque: 20, imagem: 'local://mini_office_pc_pro.jpg', cor: '#37474F', destaque: 0 },
  { nome: 'Notebook Gamer 17" RTX 4070', nome_short: 'Notebook Gamer 17"', descricao: 'Intel Core i7-13700H, tela IPS 17.3" FHD 144Hz, NVIDIA RTX 4070 8GB, 16GB DDR5, SSD 1TB NVMe. Design agressivo com iluminação RGB por zona. Resfriamento duplo fan com 6 heatpipes.', preco: 5899.99, preco_original: 6499.99, categoria: 'Notebooks', avaliacao: 4.7, avaliacoes: 63, estoque: 9, imagem: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80&auto=format&fit=crop', cor: '#B71C1C', destaque: 1 },
  { nome: 'Notebook Empresarial 14"', nome_short: 'Notebook Empresarial', descricao: 'Intel Core i5-1335U, tela FHD IPS 14" anti-reflexo, 8GB DDR4, SSD 512GB. Certificação MIL-STD-810H, leitor de digital, webcam HD com privacidade física. Bateria 72Wh com carregamento rápido.', preco: 2699.99, preco_original: 3099.99, categoria: 'Notebooks', avaliacao: 4.3, avaliacoes: 102, estoque: 18, imagem: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&q=80&auto=format&fit=crop', cor: '#1B5E20', destaque: 0 },
  { nome: 'Headset Gamer 7.1 Surround', nome_short: 'Headset Gamer 7.1', descricao: 'Áudio 7.1 surround virtual, drivers 50mm, microfone retrátil com cancelamento de ruído, almofadas de couro espuma-memória. Compatível com PC, PS5 e Xbox via USB + P2.', preco: 319.99, preco_original: 399.99, categoria: 'Periféricos', avaliacao: 4.5, avaliacoes: 189, estoque: 31, imagem: 'local://headset_gamer.jpg', cor: '#6A1B9A', destaque: 0 },
  { nome: 'Webcam 4K 60fps', nome_short: 'Webcam 4K', descricao: 'Resolução 4K 30fps / 1080p 60fps, sensor Sony CMOS, autofoco por IA, campo de visão 90°, microfone duplo com cancelamento de eco. Plug-and-play USB-C. Ideal para streaming e videoconferências.', preco: 499.99, preco_original: 649.99, categoria: 'Periféricos', avaliacao: 4.6, avaliacoes: 74, estoque: 14, imagem: 'local://webcam_4k.jpg', cor: '#00838F', destaque: 0 },
  { nome: 'Placa de Vídeo RTX 4060 8GB', nome_short: 'RTX 4060 8GB', descricao: 'NVIDIA GeForce RTX 4060 8GB GDDR6, arquitetura Ada Lovelace, DLSS 3, Ray Tracing, clock boost 2460MHz. Dual fan, TDP 115W. Ótima relação custo-benefício para 1080p e 1440p.', preco: 2199.99, preco_original: 2599.99, categoria: 'Componentes', avaliacao: 4.7, avaliacoes: 241, estoque: 11, imagem: 'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=500&q=80&auto=format&fit=crop', cor: '#1A237E', destaque: 1 },
  { nome: 'Memória RAM DDR5 32GB 5600MHz', nome_short: 'RAM DDR5 32GB', descricao: 'Kit 2×16GB DDR5 5600MHz CL36, dissipador alumínio RGB ARGB. Compatível com Intel 12ª/13ª/14ª geração e AMD AM5. XMP 3.0 para overclock automático via BIOS.', preco: 599.99, preco_original: 749.99, categoria: 'Componentes', avaliacao: 4.8, avaliacoes: 137, estoque: 26, imagem: 'local://memoria ram.jpeg', cor: '#880E4F', destaque: 0 },
  { nome: 'Processador AMD Ryzen 7 7700X', nome_short: 'Ryzen 7 7700X', descricao: '8 núcleos / 16 threads, clock base 4.5GHz boost até 5.4GHz, cache L3 32MB, TDP 105W. Arquitetura Zen 4 com suporte a DDR5 e PCIe 5.0. Sem cooler incluso.', preco: 1499.99, preco_original: 1899.99, categoria: 'Componentes', avaliacao: 4.9, avaliacoes: 209, estoque: 17, imagem: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=500&q=80&auto=format&fit=crop', cor: '#E65100', destaque: 0 },
];

const inicializarBanco = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log("✅ Conectado ao banco de dados com sucesso!");

    await connection.query(CREATE_TABLE_USUARIOS);
    console.log('✅ Tabela "usuarios" verificada/criada com sucesso!');

    await connection.query(CREATE_TABLE_ADMINS);
    console.log('✅ Tabela "admins" verificada/criada com sucesso!');

    await connection.query(CREATE_TABLE_PRODUTOS);
    console.log('✅ Tabela "produtos" verificada/criada com sucesso!');

    // Admin padrão
    const [admins] = await connection.query(
      "SELECT id FROM admins WHERE usuario = ?", ["adm"]
    );
    if (admins.length === 0) {
      const senhaHash = await bcrypt.hash("adm", 10);
      await connection.query("INSERT INTO admins (usuario, senha) VALUES (?, ?)", ["adm", senhaHash]);
      console.log('✅ Admin padrão criado: usuário "adm" / senha "adm"');
    } else {
      console.log("✅ Admin padrão já existe.");
    }

    // Seed de produtos (só roda se a tabela estiver vazia)
    const [rows] = await connection.query("SELECT COUNT(*) as total FROM produtos");
    if (rows[0].total === 0) {
      for (const p of SEED_PRODUTOS) {
        await connection.query(
          `INSERT INTO produtos
            (nome, nome_short, descricao, preco, preco_original, categoria, avaliacao, avaliacoes, estoque, imagem, cor, destaque)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [p.nome, p.nome_short, p.descricao, p.preco, p.preco_original,
           p.categoria, p.avaliacao, p.avaliacoes, p.estoque, p.imagem, p.cor, p.destaque]
        );
      }
      console.log(`✅ ${SEED_PRODUTOS.length} produtos inseridos no banco com sucesso!`);
    } else {
      console.log(`✅ Tabela produtos já contém ${rows[0].total} registro(s).`);
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
