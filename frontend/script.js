// Configuração da API
const API_BASE_URL = 'http://localhost:3000';

// Estado do carrinho (armazenado no localStorage)
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Estado do usuário logado
let usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado')) || null;

// Função para listar sabores no cardápio
async function listarSabores() {
    try {
        const loading = document.getElementById('loading');
        const container = document.getElementById('lista-sabores');
        
        if (loading) loading.style.display = 'block';
        if (container) container.innerHTML = '';
        
        const res = await fetch(`${API_BASE_URL}/sabores`);
        const sabores = await res.json();
        
        if (loading) loading.style.display = 'none';
        
        if (container) {
            sabores.forEach(sabor => {
                const saborCard = document.createElement('div');
                saborCard.className = 'sabor-card';
                saborCard.innerHTML = `
                    <img src="${sabor.imagem || 'https://via.placeholder.com/200x150?text=Sorvete'}" alt="${sabor.nome}">
                    <h4>${sabor.nome}</h4>
                    <p>${sabor.descricao}</p>
                    <div class="sabor-preco">R$ ${parseFloat(sabor.preco).toFixed(2)}</div>
                `;
                container.appendChild(saborCard);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar sabores:', error);
        const loading = document.getElementById('loading');
        if (loading) {
            loading.innerHTML = '<p style="color: red;">Erro ao carregar sabores. Verifique se a API está funcionando.</p>';
        }
    }
}

// Função para fazer login
async function fazerLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const messageDiv = document.getElementById('login-message');
    
    try {
        const res = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });
        
        if (res.ok) {
            const resposta = await res.json();
            usuarioLogado = resposta.cliente;
            localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
            localStorage.setItem('token', resposta.token);
            
            messageDiv.innerHTML = '<div class="message success">Login realizado com sucesso!</div>';
            
            // Redirecionar para a página inicial após 1.5 segundos
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            const errorData = await res.json();
            messageDiv.innerHTML = `<div class="message error">${errorData.error}</div>`;
        }
    } catch (error) {
        console.error('Erro no login:', error);
        messageDiv.innerHTML = '<div class="message error">Erro ao fazer login. Tente novamente.</div>';
    }
}

// Função para cadastrar cliente
async function cadastrarCliente(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmar-senha').value;
    const messageDiv = document.getElementById('cadastro-message');
    
    // Validar se as senhas coincidem
    if (senha !== confirmarSenha) {
        messageDiv.innerHTML = '<div class="message error">As senhas não coincidem.</div>';
        return;
    }
    
    try {
        const res = await fetch(`${API_BASE_URL}/clientes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, email, senha, telefone })
        });
        
        if (res.ok) {
            messageDiv.innerHTML = '<div class="message success">Cadastro realizado com sucesso! Redirecionando para login...</div>';
            
            // Limpar formulário
            document.getElementById('cadastro-form').reset();
            
            // Redirecionar para login após 2 segundos
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            const errorData = await res.json();
            messageDiv.innerHTML = `<div class="message error">${errorData.error}</div>`;
        }
    } catch (error) {
        console.error('Erro no cadastro:', error);
        messageDiv.innerHTML = '<div class="message error">Erro ao cadastrar. Tente novamente.</div>';
    }
}

// Função para carregar sabores no carrinho
async function carregarSaboresCarrinho() {
    try {
        const loading = document.getElementById('loading-sabores');
        const container = document.getElementById('sabores-carrinho');
        
        if (loading) loading.style.display = 'block';
        if (container) container.innerHTML = '';
        
        const res = await fetch(`${API_BASE_URL}/sabores`);
        const sabores = await res.json();
        
        if (loading) loading.style.display = 'none';
        
        if (container) {
            sabores.forEach(sabor => {
                const quantidade = getQuantidadeCarrinho(sabor.id);
                const saborItem = document.createElement('div');
                saborItem.className = 'sabor-carrinho-item';
                saborItem.innerHTML = `
                    <div class="sabor-info">
                        <h4>${sabor.nome}</h4>
                        <p>${sabor.descricao}</p>
                        <p><strong>R$ ${parseFloat(sabor.preco).toFixed(2)}</strong></p>
                    </div>
                    <div class="quantidade-controle">
                        <button onclick="diminuirQuantidade(${sabor.id})">-</button>
                        <span id="qtd-${sabor.id}">${quantidade}</span>
                        <button onclick="aumentarQuantidade(${sabor.id}, '${sabor.nome}', ${sabor.preco})">+</button>
                    </div>
                `;
                container.appendChild(saborItem);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar sabores:', error);
        const loading = document.getElementById('loading-sabores');
        if (loading) {
            loading.innerHTML = '<p style="color: red;">Erro ao carregar sabores.</p>';
        }
    }
}

// Funções do carrinho
function getQuantidadeCarrinho(saborId) {
    const item = carrinho.find(item => item.saborId === saborId);
    return item ? item.quantidade : 0;
}

function aumentarQuantidade(saborId, nome, preco) {
    const itemExistente = carrinho.find(item => item.saborId === saborId);
    
    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({
            saborId: saborId,
            nome: nome,
            preco: parseFloat(preco),
            quantidade: 1
        });
    }
    
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarQuantidadeDisplay(saborId);
    atualizarCarrinho();
}

function diminuirQuantidade(saborId) {
    const itemIndex = carrinho.findIndex(item => item.saborId === saborId);
    
    if (itemIndex > -1) {
        if (carrinho[itemIndex].quantidade > 1) {
            carrinho[itemIndex].quantidade--;
        } else {
            carrinho.splice(itemIndex, 1);
        }
    }
    
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarQuantidadeDisplay(saborId);
    atualizarCarrinho();
}

function atualizarQuantidadeDisplay(saborId) {
    const qtdElement = document.getElementById(`qtd-${saborId}`);
    if (qtdElement) {
        qtdElement.textContent = getQuantidadeCarrinho(saborId);
    }
}

function atualizarCarrinho() {
    const itensContainer = document.getElementById('itens-carrinho');
    const totalElement = document.getElementById('total-carrinho');
    
    if (!itensContainer || !totalElement) return;
    
    if (carrinho.length === 0) {
        itensContainer.innerHTML = '<p class="carrinho-vazio">Seu carrinho está vazio</p>';
        totalElement.textContent = '0.00';
        return;
    }
    
    let total = 0;
    itensContainer.innerHTML = '';
    
    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-carrinho';
        itemDiv.innerHTML = `
            <div>
                <strong>${item.nome}</strong><br>
                <small>${item.quantidade}x R$ ${item.preco.toFixed(2)}</small>
            </div>
            <div>R$ ${subtotal.toFixed(2)}</div>
        `;
        itensContainer.appendChild(itemDiv);
    });
    
    totalElement.textContent = total.toFixed(2);
}

function limparCarrinho() {
    carrinho = [];
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    
    // Atualizar displays de quantidade
    document.querySelectorAll('[id^="qtd-"]').forEach(element => {
        element.textContent = '0';
    });
    
    atualizarCarrinho();
}

async function finalizarPedido() {
    if (carrinho.length === 0) {
        document.getElementById('carrinho-message').innerHTML = 
            '<div class="message error">Seu carrinho está vazio!</div>';
        return;
    }
    
    if (!usuarioLogado) {
        document.getElementById('carrinho-message').innerHTML = 
            '<div class="message error">Você precisa estar logado para fazer um pedido. <a href="login.html">Faça login aqui</a></div>';
        return;
    }
    
    try {
        const itens = carrinho.map(item => ({
            saborId: item.saborId,
            quantidade: item.quantidade
        }));
        
        const res = await fetch(`${API_BASE_URL}/pedidos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                clienteId: usuarioLogado.id,
                itens: itens
            })
        });
        
        if (res.ok) {
            document.getElementById('carrinho-message').innerHTML = 
                '<div class="message success">Pedido realizado com sucesso!</div>';
            
            // Limpar carrinho após pedido
            setTimeout(() => {
                limparCarrinho();
                document.getElementById('carrinho-message').innerHTML = '';
            }, 3000);
        } else {
            document.getElementById('carrinho-message').innerHTML = 
                '<div class="message error">Erro ao finalizar pedido. Tente novamente.</div>';
        }
    } catch (error) {
        console.error('Erro ao finalizar pedido:', error);
        document.getElementById('carrinho-message').innerHTML = 
            '<div class="message error">Erro ao finalizar pedido. Tente novamente.</div>';
    }
}

// Função para fazer logout
function logout() {
    usuarioLogado = null;
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'index.html';
}

// Atualizar interface baseado no login
function atualizarInterface() {
    const navElement = document.querySelector('nav ul');
    if (!navElement) return;
    
    if (usuarioLogado) {
        // Usuário logado - mostrar nome e logout
        const loginLink = navElement.querySelector('a[href="login.html"]');
        if (loginLink) {
            loginLink.textContent = `Olá, ${usuarioLogado.nome}`;
            loginLink.href = '#';
            loginLink.onclick = logout;
        }
        
        // Se for admin, adicionar link para página de administração
        if (usuarioLogado.email === 'admin@sorveteria.com') {
            const adminLinkExists = navElement.querySelector('a[href="admin.html"]');
            if (!adminLinkExists) {
                const adminLi = document.createElement('li');
                adminLi.innerHTML = '<a href="admin.html">Admin</a>';
                
                // Inserir antes do último item (Login/Logout)
                const lastLi = navElement.lastElementChild;
                navElement.insertBefore(adminLi, lastLi);
            }
        }
    } else {
        // Remover link de admin se existir
        const adminLink = navElement.querySelector('a[href="admin.html"]');
        if (adminLink) {
            adminLink.parentElement.remove();
        }
    }
}

// Inicializar interface quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    atualizarInterface();
});