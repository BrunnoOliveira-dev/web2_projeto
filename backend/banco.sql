-- Script para criação do banco de dados da Sorveteria
-- Execute este script no MySQL para criar as tabelas necessárias

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS sorveteria CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sorveteria;

-- Tabela de Clientes
CREATE TABLE IF NOT EXISTS Clientes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ativo BOOLEAN DEFAULT TRUE
);

-- Tabela de Sabores
CREATE TABLE IF NOT EXISTS Sabores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL UNIQUE,
  descricao TEXT NOT NULL,
  preco DECIMAL(6,2) NOT NULL,
  imagem VARCHAR(255),
  ativo BOOLEAN DEFAULT TRUE,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS Pedidos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  clienteId INT NOT NULL,
  data DATETIME DEFAULT CURRENT_TIMESTAMP,
  status ENUM('Pendente', 'Em Preparo', 'Pronto', 'Entregue', 'Cancelado') DEFAULT 'Pendente',
  observacoes TEXT,
  total DECIMAL(8,2),
  FOREIGN KEY (clienteId) REFERENCES Clientes(id) ON DELETE CASCADE
);

-- Tabela de Itens do Pedido
CREATE TABLE IF NOT EXISTS ItensPedido (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pedidoId INT NOT NULL,
  saborId INT NOT NULL,
  quantidade INT NOT NULL DEFAULT 1,
  preco_unitario DECIMAL(6,2),
  subtotal DECIMAL(8,2),
  FOREIGN KEY (pedidoId) REFERENCES Pedidos(id) ON DELETE CASCADE,
  FOREIGN KEY (saborId) REFERENCES Sabores(id) ON DELETE RESTRICT
);

-- Índices para melhor performance
CREATE INDEX idx_clientes_email ON Clientes(email);
CREATE INDEX idx_pedidos_cliente ON Pedidos(clienteId);
CREATE INDEX idx_pedidos_data ON Pedidos(data);
CREATE INDEX idx_pedidos_status ON Pedidos(status);
CREATE INDEX idx_itens_pedido ON ItensPedido(pedidoId);
CREATE INDEX idx_itens_sabor ON ItensPedido(saborId);

-- Inserir sabores iniciais
INSERT INTO Sabores (nome, descricao, preco, imagem) VALUES
('Chocolate', 'Delicioso sorvete de chocolate cremoso feito com cacau premium', 5.50, 'chocolate.jpg'),
('Morango', 'Sorvete refrescante de morango com pedaços da fruta', 5.00, 'morango.jpg'),
('Baunilha', 'Clássico sorvete de baunilha com aroma natural', 4.80, 'baunilha.jpg'),
('Pistache', 'Sofisticado sorvete de pistache com sabor único', 6.50, 'pistache.jpg'),
('Coco', 'Sorvete tropical de coco com coco ralado', 5.20, 'coco.jpg'),
('Limão', 'Sorvete azedinho de limão, perfeito para o verão', 4.90, 'limao.jpg'),
('Cookies & Cream', 'Sorvete de baunilha com pedaços de biscoito', 6.00, 'cookies.jpg'),
('Amendoim', 'Sorvete cremoso de amendoim com pedaços crocantes', 5.80, 'amendoim.jpg'),
('Manga', 'Sorvete tropical de manga com polpa natural', 5.30, 'manga.jpg'),
('Chocolate Amargo', 'Sorvete de chocolate 70% cacau para paladares refinados', 6.20, 'chocolate_amargo.jpg');

-- Criar usuário administrador de exemplo (senha: admin123)
-- Nota: Em produção, use senhas mais seguras e criptografadas
INSERT INTO Clientes (nome, email, senha, telefone) VALUES
('Administrador', 'admin@sorveteria.com', '$2a$10$HUu5hpxWr8jW1I7WLxhIouc/4abO94N7MQ9lQPptnGCiWH88.K0lu', '(11) 99999-9999');

-- Trigger para calcular o total do pedido automaticamente
DELIMITER //
CREATE TRIGGER tr_atualizar_total_pedido 
AFTER INSERT ON ItensPedido
FOR EACH ROW
BEGIN
    UPDATE Pedidos 
    SET total = (
        SELECT SUM(ip.quantidade * s.preco)
        FROM ItensPedido ip
        JOIN Sabores s ON ip.saborId = s.id
        WHERE ip.pedidoId = NEW.pedidoId
    )
    WHERE id = NEW.pedidoId;
END//

CREATE TRIGGER tr_atualizar_total_pedido_update
AFTER UPDATE ON ItensPedido
FOR EACH ROW
BEGIN
    UPDATE Pedidos 
    SET total = (
        SELECT SUM(ip.quantidade * s.preco)
        FROM ItensPedido ip
        JOIN Sabores s ON ip.saborId = s.id
        WHERE ip.pedidoId = NEW.pedidoId
    )
    WHERE id = NEW.pedidoId;
END//

CREATE TRIGGER tr_atualizar_total_pedido_delete
AFTER DELETE ON ItensPedido
FOR EACH ROW
BEGIN
    UPDATE Pedidos 
    SET total = COALESCE((
        SELECT SUM(ip.quantidade * s.preco)
        FROM ItensPedido ip
        JOIN Sabores s ON ip.saborId = s.id
        WHERE ip.pedidoId = OLD.pedidoId
    ), 0)
    WHERE id = OLD.pedidoId;
END//
DELIMITER ;

-- Verificar se tudo foi criado corretamente
SHOW TABLES;
SELECT 'Banco de dados criado com sucesso!' as status;