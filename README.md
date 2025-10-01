# Sistema de Sorveteria - Projeto Web2

Sistema completo para gerenciamento de sorveteria com frontend e backend integrados.

## Estrutura do Projeto

```
web2_projeto/
├── frontend/
│   ├── index.html
│   ├── cardapio.html
│   ├── login.html
│   ├── cadastro.html
│   ├── carrinho.html
│   ├── style.css
│   └── script.js
├── backend/
│   ├── routes/
│   │   ├── sabores.routes.js
│   │   ├── clientes.routes.js
│   │   └── pedidos.routes.js
│   ├── server.js
│   ├── db.js
│   ├── banco.sql
│   ├── package.json
│   ├── .env
│   └── install.sh
└── README.md
```

## Como Executar o Projeto

### 1. Configurar o Backend (API)

**Instalação Normal:**
```bash
cd backend
./install.sh          # Instalação automática
npm run dev           # Iniciar servidor
```

**Instalação Manual (qualquer sistema):**
```bash
cd backend
npm install
cp .env.example .env  # Configure suas credenciais
mysql -u root -p < banco.sql
npm run dev
```

### 2. Configurar o Frontend

```bash
cd frontend

# Usando um servidor web local (escolha uma opção):

# Opção 1: Python
python -m http.server 8000

# Opção 2: Node.js (instale globally)
npm install -g http-server
http-server -p 8000

# Opção 3: VS Code Live Server Extension
# Clique com botão direito em index.html > "Open with Live Server"
```

### 3. Acessar o Sistema

- **Frontend**: http://localhost:8000d
- **API**: http://localhost:3000
- **Documentação da API**: http://localhost:3000

## Funcionalidades

### Frontend
- ✅ Página inicial atrativa
- ✅ Catálogo de sabores dinâmico
- ✅ Sistema de login/cadastro
- ✅ Carrinho de compras funcional
- ✅ Interface responsiva
- ✅ Integração completa com API

### Backend (API REST)
- ✅ CRUD completo de sabores
- ✅ Sistema de autenticação
- ✅ Gerenciamento de clientes
- ✅ Sistema de pedidos
- ✅ Validações e segurança
- ✅ Documentação integrada

### Banco de Dados
- ✅ Estrutura normalizada
- ✅ Relacionamentos consistentes
- ✅ Índices para performance
- ✅ Triggers para cálculos automáticos
- ✅ Dados de exemplo inclusos

## �️ Sistemas Operacionais Suportados

### Instalação Automática
- ✅ **Ubuntu/Debian** (apt)
- ✅ **Fedora** (dnf)
- ✅ **CentOS/RHEL** (dnf/yum)
- ✅ **Arch Linux** (pacman)
- ✅ **macOS** (homebrew)
- ✅ **Windows 10/11** (winget/chocolatey)

### Scripts de Instalação
- `install.sh` - Linux/macOS/WSL
- `install.ps1` - Windows PowerShell
- `install.bat` - Windows Prompt
- Instalação manual para outros sistemas

## �🔧 Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica
- **CSS3**: Estilização moderna com gradientes e animações
- **JavaScript ES6+**: Fetch API, async/await, localStorage
- **Design Responsivo**: Mobile-first approach

### Backend
- **Node.js**: Runtime JavaScript
- **Express.js**: Framework web
- **MySQL**: Banco de dados relacional
- **bcryptjs**: Criptografia de senhas
- **jsonwebtoken**: Autenticação JWT
- **cors**: Política de origem cruzada

## 📋 Endpoints da API

### Sabores
```
GET    /sabores           # Listar todos
GET    /sabores/:id       # Buscar por ID
POST   /sabores           # Criar novo
PUT    /sabores/:id       # Atualizar
DELETE /sabores/:id       # Excluir
```

### Clientes
```
POST   /clientes          # Cadastrar
GET    /clientes/:id      # Buscar por ID
PUT    /clientes/:id      # Atualizar
```

### Autenticação
```
POST   /login             # Fazer login
```

### Pedidos
```
POST   /pedidos                 # Criar pedido
GET    /pedidos/:clienteId      # Lista do cliente
GET    /pedidos/detalhes/:id    # Detalhes do pedido
PUT    /pedidos/:id/status      # Atualizar status
GET    /pedidos                 # Todos os pedidos
```

## Segurança Implementada

- ✅ Senhas criptografadas (bcrypt)
- ✅ Validação de entrada de dados
- ✅ Proteção contra SQL Injection
- ✅ CORS configurado
- ✅ Autenticação JWT
- ✅ Sanitização de dados

## 💾 Banco de Dados

### Tabelas Principais
- **Clientes**: Usuários do sistema
- **Sabores**: Produtos disponíveis
- **Pedidos**: Pedidos realizados
- **ItensPedido**: Itens de cada pedido

### Funcionalidades Avançadas
- Triggers para cálculo automático de totais
- Índices para otimização de consultas
- Relacionamentos com integridade referencial
- Dados de exemplo pré-cadastrados

## Design e UX

- Interface moderna e intuitiva
- Paleta de cores atrativa
- Animações e efeitos visuais
- Layout responsivo para todos os dispositivos
- Feedback visual para todas as ações
- Loading states e tratamento de erros

## 🧪 Como Testar

### 1. Testar a API
```bash
# Health check
curl http://localhost:3000/health

# Listar sabores
curl http://localhost:3000/sabores

# Fazer login (use dados do banco.sql)
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sorveteria.com","senha":"admin123"}'
```

### 2. Testar o Frontend
1. Acesse http://localhost:8000
2. Navegue pelas páginas
3. Cadastre uma conta
4. Faça login
5. Adicione itens ao carrinho
6. Finalize um pedido

## Troubleshooting

### API não inicia
- Verifique se o MySQL está rodando
- Confirme as credenciais no `.env`
- Execute o script `banco.sql`

### Frontend não conecta com API
- Verifique se a API está rodando na porta 3000
- Confirme a URL em `script.js`
- Abra o console do navegador para ver erros

### Erro de CORS
- A API já está configurada para aceitar requisições do frontend
- Verifique se as portas estão corretas

## Licença

Este projeto é desenvolvido para fins educacionais no curso de TI.

---

** Sorveteria Cream Dreamica - Sabores únicos, experiência digital completa!**