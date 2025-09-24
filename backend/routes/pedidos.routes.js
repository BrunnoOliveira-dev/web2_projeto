const express = require('express');
const router = express.Router();
const { query } = require('../db');

// POST /pedidos - Criar novo pedido
router.post('/pedidos', async (req, res) => {
  try {
    const { clienteId, itens } = req.body;
    
    // Validações básicas
    if (!clienteId || !itens || !Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ error: 'Cliente e itens são obrigatórios' });
    }
    
    // Verificar se o cliente existe
    const clienteExistente = await query('SELECT * FROM Clientes WHERE id = ?', [clienteId]);
    if (clienteExistente.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    // Validar itens do pedido
    for (const item of itens) {
      if (!item.saborId || !item.quantidade || item.quantidade <= 0) {
        return res.status(400).json({ error: 'Todos os itens devem ter saborId e quantidade válidos' });
      }
      
      // Verificar se o sabor existe
      const saborExistente = await query('SELECT * FROM Sabores WHERE id = ?', [item.saborId]);
      if (saborExistente.length === 0) {
        return res.status(404).json({ error: `Sabor com ID ${item.saborId} não encontrado` });
      }
    }
    
    // Iniciar transação para garantir consistência
    const connection = await query('START TRANSACTION');
    
    try {
      // Inserir pedido
      const resultPedido = await query(
        'INSERT INTO Pedidos (clienteId, data, status) VALUES (?, NOW(), ?)',
        [clienteId, 'Pendente']
      );
      
      const pedidoId = resultPedido.insertId;
      
      // Inserir itens do pedido
      for (const item of itens) {
        await query(
          'INSERT INTO ItensPedido (pedidoId, saborId, quantidade) VALUES (?, ?, ?)',
          [pedidoId, item.saborId, item.quantidade]
        );
      }
      
      // Confirmar transação
      await query('COMMIT');
      
      res.status(201).json({ 
        message: 'Pedido criado com sucesso',
        pedidoId: pedidoId 
      });
    } catch (error) {
      // Reverter transação em caso de erro
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /pedidos/:clienteId - Buscar pedidos de um cliente
router.get('/pedidos/:clienteId', async (req, res) => {
  try {
    const { clienteId } = req.params;
    
    // Verificar se o cliente existe
    const clienteExistente = await query('SELECT * FROM Clientes WHERE id = ?', [clienteId]);
    if (clienteExistente.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    // Buscar pedidos do cliente
    const pedidos = await query(
      'SELECT * FROM Pedidos WHERE clienteId = ? ORDER BY data DESC',
      [clienteId]
    );
    
    res.json(pedidos);
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /pedidos/detalhes/:pedidoId - Buscar detalhes de um pedido específico
router.get('/pedidos/detalhes/:pedidoId', async (req, res) => {
  try {
    const { pedidoId } = req.params;
    
    // Buscar informações do pedido
    const pedidos = await query('SELECT * FROM Pedidos WHERE id = ?', [pedidoId]);
    if (pedidos.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    
    const pedido = pedidos[0];
    
    // Buscar itens do pedido com informações dos sabores
    const itens = await query(`
      SELECT 
        ip.quantidade,
        s.id as saborId,
        s.nome as saborNome,
        s.descricao as saborDescricao,
        s.preco as saborPreco,
        s.imagem as saborImagem,
        (ip.quantidade * s.preco) as subtotal
      FROM ItensPedido ip
      JOIN Sabores s ON ip.saborId = s.id
      WHERE ip.pedidoId = ?
    `, [pedidoId]);
    
    // Calcular total do pedido
    const total = itens.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
    
    res.json({
      ...pedido,
      itens,
      total: total.toFixed(2)
    });
  } catch (error) {
    console.error('Erro ao buscar detalhes do pedido:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /pedidos/:pedidoId/status - Atualizar status do pedido
router.put('/pedidos/:pedidoId/status', async (req, res) => {
  try {
    const { pedidoId } = req.params;
    const { status } = req.body;
    
    // Validar status
    const statusValidos = ['Pendente', 'Em Preparo', 'Pronto', 'Entregue', 'Cancelado'];
    if (!statusValidos.includes(status)) {
      return res.status(400).json({ 
        error: 'Status inválido. Valores permitidos: ' + statusValidos.join(', ') 
      });
    }
    
    // Verificar se o pedido existe
    const pedidoExistente = await query('SELECT * FROM Pedidos WHERE id = ?', [pedidoId]);
    if (pedidoExistente.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    
    // Atualizar status
    await query('UPDATE Pedidos SET status = ? WHERE id = ?', [status, pedidoId]);
    
    res.json({ message: 'Status do pedido atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /pedidos - Listar todos os pedidos (para administradores)
router.get('/pedidos', async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    
    let sql = `
      SELECT 
        p.*,
        c.nome as clienteNome,
        c.email as clienteEmail,
        c.telefone as clienteTelefone
      FROM Pedidos p
      JOIN Clientes c ON p.clienteId = c.id
    `;
    
    const params = [];
    
    if (status) {
      sql += ' WHERE p.status = ?';
      params.push(status);
    }
    
    sql += ' ORDER BY p.data DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const pedidos = await query(sql, params);
    
    res.json(pedidos);
  } catch (error) {
    console.error('Erro ao listar pedidos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;