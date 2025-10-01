// Verificar se o usuário é administrador
function verificarAdmin() {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    
    if (!usuario || usuario.email !== 'admin@sorveteria.com') {
        alert('Acesso negado. Apenas administradores podem acessar esta página.');
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Mostrar/esconder abas
function showTab(tabName) {
    // Esconder todas as abas
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.add('hidden');
    });
    
    // Remover classe active de todos os botões
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar aba selecionada
    document.getElementById(tabName + '-tab').classList.remove('hidden');
    
    // Adicionar classe active ao botão clicado
    event.target.classList.add('active');
}

// Carregar sabores para administração
async function carregarSaboresAdmin() {
    try {
        const loading = document.getElementById('loading-sabores');
        const container = document.getElementById('lista-sabores-admin');
        
        if (loading) loading.style.display = 'block';
        if (container) container.innerHTML = '';
        
        const res = await fetch(`${API_BASE_URL}/sabores`);
        const sabores = await res.json();
        
        if (loading) loading.style.display = 'none';
        
        if (container) {
            sabores.forEach(sabor => {
                const saborCard = document.createElement('div');
                saborCard.className = 'sabor-admin-card';
                saborCard.innerHTML = `
                    <div class="sabor-info">
                        <img src="${sabor.imagem || 'https://via.placeholder.com/80x60?text=Sorvete'}" alt="${sabor.nome}">
                        <div class="sabor-details">
                            <h4>${sabor.nome}</h4>
                            <p>${sabor.descricao}</p>
                            <div class="sabor-preco">R$ ${parseFloat(sabor.preco).toFixed(2)}</div>
                        </div>
                    </div>
                    <div class="sabor-actions">
                        <button onclick="editarSabor(${sabor.id})" class="btn-edit">Editar</button>
                        <button onclick="excluirSabor(${sabor.id})" class="btn-delete">Excluir</button>
                    </div>
                `;
                container.appendChild(saborCard);
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

// Salvar sabor (criar ou editar)
document.getElementById('sabor-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const saborData = {
        nome: formData.get('nome'),
        descricao: formData.get('descricao'),
        preco: parseFloat(formData.get('preco')),
        imagem: formData.get('imagem') || null
    };
    
    const saborId = formData.get('id');
    const isEditing = saborId && saborId !== '';
    
    try {
        const url = isEditing ? `${API_BASE_URL}/sabores/${saborId}` : `${API_BASE_URL}/sabores`;
        const method = isEditing ? 'PUT' : 'POST';
        
        const res = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(saborData)
        });
        
        if (res.ok) {
            document.getElementById('admin-message').innerHTML = 
                `<div class="message success">${isEditing ? 'Sabor atualizado' : 'Sabor criado'} com sucesso!</div>`;
            
            // Limpar formulário
            e.target.reset();
            document.getElementById('sabor-id').value = '';
            document.getElementById('form-title').textContent = 'Adicionar Novo Sabor';
            
            // Recarregar lista
            carregarSaboresAdmin();
            
            // Limpar mensagem após 3 segundos
            setTimeout(() => {
                document.getElementById('admin-message').innerHTML = '';
            }, 3000);
        } else {
            const errorData = await res.json();
            document.getElementById('admin-message').innerHTML = 
                `<div class="message error">${errorData.error}</div>`;
        }
    } catch (error) {
        console.error('Erro ao salvar sabor:', error);
        document.getElementById('admin-message').innerHTML = 
            '<div class="message error">Erro ao salvar sabor. Tente novamente.</div>';
    }
});

// Editar sabor
async function editarSabor(id) {
    try {
        const res = await fetch(`${API_BASE_URL}/sabores/${id}`);
        const sabor = await res.json();
        
        // Preencher formulário
        document.getElementById('sabor-id').value = sabor.id;
        document.getElementById('nome').value = sabor.nome;
        document.getElementById('descricao').value = sabor.descricao;
        document.getElementById('preco').value = sabor.preco;
        document.getElementById('imagem').value = sabor.imagem || '';
        
        // Alterar título do formulário
        document.getElementById('form-title').textContent = 'Editar Sabor';
        
        // Scroll para o formulário
        document.getElementById('sabor-form').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Erro ao carregar sabor para edição:', error);
        alert('Erro ao carregar dados do sabor.');
    }
}

// Cancelar edição
function cancelarEdicao() {
    document.getElementById('sabor-form').reset();
    document.getElementById('sabor-id').value = '';
    document.getElementById('form-title').textContent = 'Adicionar Novo Sabor';
    document.getElementById('admin-message').innerHTML = '';
}

// Excluir sabor
async function excluirSabor(id) {
    if (!confirm('Tem certeza que deseja excluir este sabor?')) {
        return;
    }
    
    try {
        const res = await fetch(`${API_BASE_URL}/sabores/${id}`, {
            method: 'DELETE'
        });
        
        if (res.ok) {
            document.getElementById('admin-message').innerHTML = 
                '<div class="message success">Sabor excluído com sucesso!</div>';
            
            carregarSaboresAdmin();
            
            setTimeout(() => {
                document.getElementById('admin-message').innerHTML = '';
            }, 3000);
        } else {
            const errorData = await res.json();
            document.getElementById('admin-message').innerHTML = 
                `<div class="message error">${errorData.error}</div>`;
        }
    } catch (error) {
        console.error('Erro ao excluir sabor:', error);
        document.getElementById('admin-message').innerHTML = 
            '<div class="message error">Erro ao excluir sabor. Tente novamente.</div>';
    }
}

// Carregar pedidos
async function carregarPedidos() {
    try {
        const loading = document.getElementById('loading-pedidos');
        const container = document.getElementById('lista-pedidos');
        
        if (loading) loading.style.display = 'block';
        if (container) container.innerHTML = '';
        
        const statusFilter = document.getElementById('status-filter').value;
        const url = statusFilter ? 
            `${API_BASE_URL}/pedidos?status=${statusFilter}` : 
            `${API_BASE_URL}/pedidos`;
        
        const res = await fetch(url);
        const pedidos = await res.json();
        
        if (loading) loading.style.display = 'none';
        
        if (container) {
            if (pedidos.length === 0) {
                container.innerHTML = '<p>Nenhum pedido encontrado.</p>';
                return;
            }
            
            pedidos.forEach(async (pedido) => {
                // Buscar detalhes do pedido
                const detalhesRes = await fetch(`${API_BASE_URL}/pedidos/detalhes/${pedido.id}`);
                const detalhes = await detalhesRes.json();
                
                const pedidoCard = document.createElement('div');
                pedidoCard.className = 'pedido-card';
                pedidoCard.innerHTML = `
                    <div class="pedido-header">
                        <h4>Pedido #${pedido.id}</h4>
                        <span class="status status-${pedido.status.toLowerCase().replace(' ', '-')}">${pedido.status}</span>
                    </div>
                    <div class="pedido-info">
                        <p><strong>Cliente:</strong> ${pedido.clienteNome}</p>
                        <p><strong>Data:</strong> ${new Date(pedido.data).toLocaleString('pt-BR')}</p>
                        <p><strong>Total:</strong> R$ ${detalhes.total}</p>
                    </div>
                    <div class="pedido-itens">
                        <h5>Itens:</h5>
                        <ul>
                            ${detalhes.itens.map(item => 
                                `<li>${item.quantidade}x ${item.saborNome} - R$ ${item.subtotal}</li>`
                            ).join('')}
                        </ul>
                    </div>
                    <div class="pedido-actions">
                        <select onchange="atualizarStatusPedido(${pedido.id}, this.value)">
                            <option value="">Alterar Status</option>
                            <option value="Pendente" ${pedido.status === 'Pendente' ? 'selected' : ''}>Pendente</option>
                            <option value="Em Preparo" ${pedido.status === 'Em Preparo' ? 'selected' : ''}>Em Preparo</option>
                            <option value="Pronto" ${pedido.status === 'Pronto' ? 'selected' : ''}>Pronto</option>
                            <option value="Entregue" ${pedido.status === 'Entregue' ? 'selected' : ''}>Entregue</option>
                            <option value="Cancelado" ${pedido.status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
                        </select>
                    </div>
                `;
                container.appendChild(pedidoCard);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        const loading = document.getElementById('loading-pedidos');
        if (loading) {
            loading.innerHTML = '<p style="color: red;">Erro ao carregar pedidos.</p>';
        }
    }
}

// Filtrar pedidos por status
function filtrarPedidos() {
    carregarPedidos();
}

// Atualizar status do pedido
async function atualizarStatusPedido(pedidoId, novoStatus) {
    if (!novoStatus) return;
    
    try {
        const res = await fetch(`${API_BASE_URL}/pedidos/${pedidoId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: novoStatus })
        });
        
        if (res.ok) {
            alert('Status do pedido atualizado com sucesso!');
            carregarPedidos();
        } else {
            const errorData = await res.json();
            alert(`Erro ao atualizar status: ${errorData.error}`);
        }
    } catch (error) {
        console.error('Erro ao atualizar status do pedido:', error);
        alert('Erro ao atualizar status do pedido.');
    }
}