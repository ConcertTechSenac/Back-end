## 📍 Estrutura de Rotas

### 🔐 Fluxo de Acesso
- `Login`: Entrada do usuário.
- `Cadastro`: Registro de novos usuários.
- `Verificacao`: Validação de e-mail (Código 4 dígitos).

### 🏠 Hub Principal (Home)
O usuário navega para as seções de produtos através de:
- **Componentes Visuais**: `ProductCards` e `Categories` redirecionam para a tela de produtos mais vendidos.
- **Barra de Navegação**: Acesso fixo no rodapé para as principais seções do app.

### ☰ Menu Lateral (Drawer)
Organizado por categorias e utilitários:
| Item | Destino | Status |
| :--- | :--- | :--- |
| Minha Conta | - | ⏳ Em breve |
| Monte seu PC | - | ⏳ Em breve |
| Mais Vendidos | `MaisVendidos` | ✅ Ativo |
| Computadores | Submenu | 📂 Expansível |
| Notebooks | Submenu | 📂 Expansível |

### 🛠️ Funções de Navegação Interna
- `navegarPara(tela)`: Função utilizada no Menu Lateral que fecha o menu automaticamente antes de realizar o `navigation.navigate`, garantindo uma transição limpa.
