
# 🚀 Backend Node.js - Projeto Mobile Offline-First

Este é o servidor backend desenvolvido para a disciplina de **Desenvolvimento para Dispositivos Móveis** (PI IV). [cite_start]O foco deste projeto é implementar uma arquitetura **Offline-First**, onde o aplicativo mobile utiliza um banco de dados local para operação constante e esta API para sincronização[cite: 8, 9, 157].

## 📋 Sobre o Projeto
[cite_start]Em um cenário de rede instável, o usuário não pode perder dados[cite: 168, 169]. [cite_start]Esta API serve como o "Sincronizador"[cite: 175, 306]:
* [cite_start]**Dispositivo (Mobile):** Fonte primária de dados usando SQLite[cite: 178, 179].
* [cite_start]**Servidor (Node.js):** Realiza o backup e mantém o estado entre múltiplos aparelhos[cite: 175, 177, 306].

## 🛠️ Tecnologias e Ferramentas
* [cite_start]**Runtime:** Node.js (Versão LTS recomendada) [cite: 113, 183]
* [cite_start]**Framework:** Express.js [cite: 189, 208]
* [cite_start]**Auto-reload:** Nodemon (apenas desenvolvimento) [cite: 210, 218]
* [cite_start]**Variáveis de Ambiente:** Dotenv [cite: 212, 217]

## 🔧 Pré-requisitos
Antes de começar, você precisará ter instalado:
1. [cite_start]**Node.js** [cite: 87, 116]
2. **Git** para versionamento.

## 🚀 Instalação e Execução

### 1. Clonar o Repositório
```bash
git clone [https://github.com/HardTechSenac/Back-end.git](https://github.com/HardTechSenac/Back-end.git)
cd Back-end 
