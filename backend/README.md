# API da Sorveteria Hipotética

API RESTful para sistema de gerenciamento de sorveteria desenvolvida em Node.js com Express e MySQL.

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- MySQL (versão 5.7 ou superior)
- npm ou yarn

## 🚀 Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd backend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o banco de dados**
   - Crie um banco MySQL
   - Execute o script `banco.sql` no seu MySQL
   - Configure as variáveis de ambiente

4. **Configure as variáveis de ambiente**
   - Copie o arquivo `.env.example` para `.env`
   - Ajuste as configurações conforme seu ambiente

5. **Inicie o servidor**
```bash
# Modo desenvolvimento (com auto-reload)
npm run dev

# Modo produção
npm start
```

## 🔧 Configuração

### Variáveis de Ambiente (.env)

```env
# Banco de dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=suasenha
DB_NAME=sorveteria
DB_PORT=3306

# Aplicação
PORT=3000
JWT_SECRET=sua_chave_secreta_jwt

# Ambiente
NODE_ENV=development
```

## 📚 Documentação da API

### Base URL
```
http://localhost:3000
```

### Endpoints

#### 🍦 Sabores

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/sabores` | Lista todos os sabores |
| GET | `/sabores/:id` | Busca sabor por ID |
| POST | `/sabores` | Cria novo sabor |
| PUT | `/sabores/:id` | Atualiza sabor |
| DELETE | `/sabores/:id` | Remove sabor |

**Exemplo - Criar sabor:**
```json
POST /sabores
{
  "nome": "Chocolate",
  "descricao": "Sorvete cremoso de chocolate",
  "preco": 5.50,
  "imagem": "chocolate.jpg"
}
```

#### 👥 Clientes

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/clientes` | Cadastra novo cliente |
| GET | `/clientes/:id` | Busca cliente por ID |
| PUT | `/clientes/:id` | Atualiza dados do cliente |

**Exemplo - Cadastrar cliente:**
```json
POST /clientes
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456",
  "telefone": "(11) 99999-9999"
}
```

#### 🔐 Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/login` | Realiza login |

**Exemplo - Login:**
```json
POST /login
{
  "email": "joao@email.com",
  "senha": "123456"
}
```

#### 📋 Pedidos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/pedidos` | Cria novo pedido |
| GET | `/pedidos/:clienteId` | Lista pedidos do cliente |
| GET | `/pedidos/detalhes/:id` | Detalhes do pedido |
| PUT | `/pedidos/:id/status` | Atualiza status do pedido |
| GET | `/pedidos` | Lista todos os pedidos |

**Exemplo - Criar pedido:**
```json
POST /pedidos
{
  "clienteId": 1,
  "itens": [
    {
      "saborId": 1,
      "quantidade": 2
    },
    {
      "saborId": 3,
      "quantidade": 1
    }
  ]
}
```

### Status dos Pedidos
- `Pendente` - Pedido recebido
- `Em Preparo` - Sendo preparado
- `Pronto` - Pronto para entrega
- `Entregue` - Entregue ao cliente
- `Cancelado` - Pedido cancelado

## 🛠️ Estrutura do Projeto

```
backend/
├── routes/
│   ├── sabores.routes.js      # Rotas dos sabores
│   ├── clientes.routes.js     # Rotas dos clientes
│   └── pedidos.routes.js      # Rotas dos pedidos
├── db.js                      # Configuração do banco
├── server.js                  # Servidor principal
├── banco.sql                  # Script do banco
├── package.json               # Dependências
└── .env                       # Variáveis de ambiente
```

## 🔒 Segurança

- Senhas são criptografadas com bcrypt
- Validação de dados de entrada
- Proteção contra SQL Injection
- CORS configurado
- JWT para autenticação

## 🚦 Tratamento de Erros

A API retorna códigos de status HTTP apropriados:

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Erro na requisição
- `401` - Não autorizado
- `404` - Não encontrado
- `409` - Conflito (dados duplicados)
- `500` - Erro interno do servidor

## 📊 Logs

O servidor registra todas as requisições no console:
```
2025-09-24T10:30:00.000Z - GET /sabores
2025-09-24T10:30:15.000Z - POST /login
```

## 🧪 Testando a API

### Health Check
```bash
GET http://localhost:3000/health
```

### Usando curl
```bash
# Listar sabores
curl http://localhost:3000/sabores

# Fazer login
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sorveteria.com","senha":"admin123"}'
```

### Usando Postman/Insomnia
Importe as collections disponíveis na pasta `docs/` (se disponível).

## 🐛 Troubleshooting

### Erro de conexão com o banco
- Verifique se o MySQL está rodando
- Confirme as credenciais no arquivo `.env`
- Execute o script `banco.sql`

### Porta já em uso
- Mude a porta no arquivo `.env`
- Ou pare o processo que está usando a porta 3000

### Dependências
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

## 📝 Scripts Disponíveis

```bash
npm start        # Inicia o servidor
npm run dev      # Inicia com auto-reload (nodemon)
npm test         # Executa testes (não implementado)
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.