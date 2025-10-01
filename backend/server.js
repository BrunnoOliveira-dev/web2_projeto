const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./db');
const saboresRoutes = require('./routes/sabores.routes');
const clientesRoutes = require('./routes/clientes.routes');
const pedidosRoutes = require('./routes/pedidos.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5500', 'http://127.0.0.1:5500'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para log das requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rota de teste
app.get('/', (req, res) => {
  res.json({
    message: 'API da Sorveteria Hipotética está funcionando!',
    version: '1.0.0',
    endpoints: {
      sabores: '/sabores',
      clientes: '/clientes',
      login: '/login',
      pedidos: '/pedidos'
    }
  });
});

// Rota de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Rotas da API
app.use('/', saboresRoutes);
app.use('/', clientesRoutes);
app.use('/', pedidosRoutes);

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    message: `A rota ${req.method} ${req.originalUrl} não existe nesta API`
  });
});

// Middleware global de tratamento de erros
app.use((error, req, res, next) => {
  console.error('Erro não tratado:', error);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Algo deu errado'
  });
});

// Iniciar servidor
async function startServer() {
  try {
    // Testar conexão com o banco
    await testConnection();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📍 Acesse: http://localhost:${PORT}`);
      console.log(`🔍 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 Documentação da API:`);
      console.log(`   - GET    /sabores           - Listar sabores`);
      console.log(`   - POST   /sabores           - Criar sabor`);
      console.log(`   - PUT    /sabores/:id       - Atualizar sabor`);
      console.log(`   - DELETE /sabores/:id       - Excluir sabor`);
      console.log(`   - POST   /clientes          - Cadastrar cliente`);
      console.log(`   - POST   /login             - Fazer login`);
      console.log(`   - GET    /clientes/:id      - Buscar cliente`);
      console.log(`   - POST   /pedidos           - Criar pedido`);
      console.log(`   - GET    /pedidos/:clienteId - Pedidos do cliente`);
      console.log(`   - GET    /pedidos/detalhes/:id - Detalhes do pedido`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Recebido SIGTERM, encerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Recebido SIGINT, encerrando servidor...');
  process.exit(0);
});

startServer();