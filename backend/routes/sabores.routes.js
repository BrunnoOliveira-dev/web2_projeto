const express = require('express');
const router = express.Router();
const { query } = require('../db');

// GET /sabores - Listar todos os sabores
router.get('/sabores', async (req, res) => {
  try {
    const sabores = await query('SELECT * FROM Sabores ORDER BY nome');
    res.json(sabores);
  } catch (error) {
    console.error('Erro ao buscar sabores:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /sabores/:id - Buscar sabor por ID
router.get('/sabores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sabores = await query('SELECT * FROM Sabores WHERE id = ?', [id]);
    
    if (sabores.length === 0) {
      return res.status(404).json({ error: 'Sabor não encontrado' });
    }
    
    res.json(sabores[0]);
  } catch (error) {
    console.error('Erro ao buscar sabor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /sabores - Adicionar novo sabor
router.post('/sabores', async (req, res) => {
  try {
    const { nome, descricao, preco, imagem } = req.body;
    
    // Validações básicas
    if (!nome || !descricao || !preco) {
      return res.status(400).json({ error: 'Nome, descrição e preço são obrigatórios' });
    }
    
    if (isNaN(preco) || preco <= 0) {
      return res.status(400).json({ error: 'Preço deve ser um número positivo' });
    }
    
    const result = await query(
      'INSERT INTO Sabores (nome, descricao, preco, imagem) VALUES (?, ?, ?, ?)',
      [nome, descricao, parseFloat(preco), imagem || null]
    );
    
    res.status(201).json({ 
      message: 'Sabor adicionado com sucesso',
      id: result.insertId 
    });
  } catch (error) {
    console.error('Erro ao adicionar sabor:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Sabor com este nome já existe' });
    } else {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
});

// PUT /sabores/:id - Atualizar sabor
router.put('/sabores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, preco, imagem } = req.body;
    
    // Verificar se o sabor existe
    const saborExistente = await query('SELECT * FROM Sabores WHERE id = ?', [id]);
    if (saborExistente.length === 0) {
      return res.status(404).json({ error: 'Sabor não encontrado' });
    }
    
    // Validações básicas
    if (!nome || !descricao || !preco) {
      return res.status(400).json({ error: 'Nome, descrição e preço são obrigatórios' });
    }
    
    if (isNaN(preco) || preco <= 0) {
      return res.status(400).json({ error: 'Preço deve ser um número positivo' });
    }
    
    await query(
      'UPDATE Sabores SET nome = ?, descricao = ?, preco = ?, imagem = ? WHERE id = ?',
      [nome, descricao, parseFloat(preco), imagem || null, id]
    );
    
    res.json({ message: 'Sabor atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar sabor:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Sabor com este nome já existe' });
    } else {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
});

// DELETE /sabores/:id - Excluir sabor
router.delete('/sabores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se o sabor existe
    const saborExistente = await query('SELECT * FROM Sabores WHERE id = ?', [id]);
    if (saborExistente.length === 0) {
      return res.status(404).json({ error: 'Sabor não encontrado' });
    }
    
    // Verificar se há pedidos com este sabor
    const pedidosComSabor = await query('SELECT * FROM ItensPedido WHERE saborId = ?', [id]);
    if (pedidosComSabor.length > 0) {
      return res.status(409).json({ 
        error: 'Não é possível excluir este sabor pois ele está associado a pedidos existentes' 
      });
    }
    
    await query('DELETE FROM Sabores WHERE id = ?', [id]);
    res.json({ message: 'Sabor excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir sabor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;