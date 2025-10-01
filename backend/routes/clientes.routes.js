const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../db');

// Função para validar email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Função para validar senha
function isValidPassword(password) {
  return password && password.length >= 6;
}

// POST /clientes - Cadastrar novo cliente
router.post('/clientes', async (req, res) => {
  try {
    const { nome, email, senha, telefone } = req.body;
    
    // Validações básicas
    if (!nome || !email || !senha || !telefone) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }
    
    if (!isValidPassword(senha)) {
      return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });
    }
    
    // Verificar se o email já está em uso
    const clienteExistente = await query('SELECT * FROM Clientes WHERE email = ?', [email]);
    if (clienteExistente.length > 0) {
      return res.status(409).json({ error: 'Este email já está cadastrado' });
    }
    
    // Criptografar senha
    const saltRounds = 10;
    // const senhaHash = await bcrypt.hash(senha, saltRounds);
    const senhaHash = senha;
    
    // Inserir cliente no banco
    const result = await query(
      'INSERT INTO Clientes (nome, email, senha, telefone) VALUES (?, ?, ?, ?)',
      [nome, email, senhaHash, telefone]
    );
    
    res.status(201).json({ 
      message: 'Cliente cadastrado com sucesso',
      id: result.insertId 
    });
  } catch (error) {
    console.error('Erro ao cadastrar cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /login - Fazer login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    // Validações básicas
    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }
    
    // Buscar cliente pelo email
    const clientes = await query('SELECT * FROM Clientes WHERE email = ?', [email]);
    
    if (clientes.length === 0) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }
    
    const cliente = clientes[0];
    
    // Verificar senha
    // const senhaValida = await bcrypt.compare(senha, cliente.senha);
    const senhaValida = senha === cliente.senha;
    if (!senhaValida) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }
    
    // Gerar token JWT (opcional, para autenticação mais robusta)
    const token = jwt.sign(
      { id: cliente.id, email: cliente.email },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '24h' }
    );
    
    // Remover senha da resposta
    const { senha: _, ...clienteSemSenha } = cliente;
    
    res.json({
      message: 'Login realizado com sucesso',
      cliente: clienteSemSenha,
      token
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /clientes/:id - Buscar cliente por ID
router.get('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const clientes = await query('SELECT id, nome, email, telefone FROM Clientes WHERE id = ?', [id]);
    
    if (clientes.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    res.json(clientes[0]);
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /clientes/:id - Atualizar dados do cliente
router.put('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, telefone } = req.body;
    
    // Verificar se o cliente existe
    const clienteExistente = await query('SELECT * FROM Clientes WHERE id = ?', [id]);
    if (clienteExistente.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    // Validações básicas
    if (!nome || !telefone) {
      return res.status(400).json({ error: 'Nome e telefone são obrigatórios' });
    }
    
    await query(
      'UPDATE Clientes SET nome = ?, telefone = ? WHERE id = ?',
      [nome, telefone, id]
    );
    
    res.json({ message: 'Cliente atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;