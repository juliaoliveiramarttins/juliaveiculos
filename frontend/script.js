// Detecta automaticamente se está em produção ou desenvolvimento
const API = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api' 
  : `${window.location.origin}/api`;

// ============= CLIENTES =============
function carregarClientes() {
  fetch(`${API}/clientes`)
    .then(res => res.json())
    .then(data => {
      const lista = document.getElementById('lista-clientes');
      if (!lista) return;
      
      lista.innerHTML = '';
      
      if (data.length === 0) {
        lista.innerHTML = '<li style="text-align: center; color: var(--text-gray);">Nenhum cliente cadastrado</li>';
        return;
      }
      
      data.forEach(c => {
        const li = document.createElement('li');
        li.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: start;">
            <div>
              <strong>${c.nome}</strong><br>
              <span style="color: var(--text-gray);">
                ${c.email} ${c.telefone ? '• ' + c.telefone : ''}
              </span>
              ${c.endereco ? '<br><span style="color: var(--text-gray); font-size: 0.9rem;">' + c.endereco + '</span>' : ''}
              ${c.data_nascimento ? '<br><span style="color: var(--text-gray); font-size: 0.9rem;">Nascimento: ' + new Date(c.data_nascimento).toLocaleDateString('pt-BR') + '</span>' : ''}
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button onclick="editarCliente(${c.cliente_id})" style="padding: 0.5rem 1rem; font-size: 0.9rem; background: var(--primary-blue); border: none; color: white; border-radius: 6px; cursor: pointer;">Editar</button>
              <button onclick="excluirCliente(${c.cliente_id})" style="padding: 0.5rem 1rem; font-size: 0.9rem; background: #ef4444; border: none; color: white; border-radius: 6px; cursor: pointer;">Excluir</button>
            </div>
          </div>
        `;
        lista.appendChild(li);
      });
    })
    .catch(err => {
      console.error('Erro ao carregar clientes:', err);
      alert('Erro ao carregar clientes. Verifique se a API está rodando.');
    });
}

function cadastrarCliente(e) {
  e.preventDefault();
  const form = e.target;
  const cliente = {
    nome: form.nome.value,
    email: form.email.value,
    telefone: form.telefone.value || null,
    data_nascimento: form.data_nascimento.value || null,
    endereco: form.endereco.value || null
  };

  const id = form.dataset.editandoId;
  const method = id ? 'PUT' : 'POST';
  const url = id ? `${API}/clientes/${id}` : `${API}/clientes`;

  console.log('Editando ID:', id, 'Method:', method, 'URL:', url);

  fetch(url, {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cliente)
  })
    .then(res => {
      if (res.ok) {
        alert(id ? 'Cliente atualizado com sucesso!' : 'Cliente cadastrado com sucesso!');
        form.reset();
        delete form.dataset.editandoId;
        form.querySelector('button[type="submit"]').textContent = 'Cadastrar Cliente';
        carregarClientes();
      } else {
        alert('Erro ao salvar cliente.');
      }
    })
    .catch(err => {
      console.error('Erro:', err);
      alert('Erro ao salvar cliente. Verifique a conexão.');
    });
}

function editarCliente(id) {
  fetch(`${API}/clientes`)
    .then(res => res.json())
    .then(clientes => {
      const cliente = clientes.find(c => c.cliente_id === id);
      if (!cliente) return;

      const form = document.getElementById('form-cliente');
      form.nome.value = cliente.nome;
      form.email.value = cliente.email;
      form.telefone.value = cliente.telefone || '';
      form.data_nascimento.value = cliente.data_nascimento ? cliente.data_nascimento.split('T')[0] : '';
      form.endereco.value = cliente.endereco || '';
      form.dataset.editandoId = id;
      form.querySelector('button[type="submit"]').textContent = 'Atualizar Cliente';
      form.scrollIntoView({ behavior: 'smooth' });
    });
}

function excluirCliente(id) {
  if (!confirm('Deseja excluir este cliente?')) return;
  fetch(`${API}/clientes/${id}`, { method: 'DELETE' })
    .then(res => {
      if (res.ok) {
        alert('Cliente excluído!');
        carregarClientes();
      } else {
        alert('Erro ao excluir cliente.');
      }
    })
    .catch(err => {
      console.error('Erro:', err);
      alert('Erro ao excluir cliente.');
    });
}

// ============= VEÍCULOS =============
function carregarVeiculos() {
  fetch(`${API}/veiculos`)
    .then(res => res.json())
    .then(data => {
      const lista = document.getElementById('lista-veiculos');
      if (!lista) return;
      
      lista.innerHTML = '';
      
      if (data.length === 0) {
        lista.innerHTML = '<li style="text-align: center; color: var(--text-gray);">Nenhum veículo cadastrado</li>';
        return;
      }
      
      data.forEach(v => {
        const li = document.createElement('li');
        li.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: start;">
            <div>
              <strong>${v.marca} ${v.modelo}</strong> (${v.ano})<br>
              <span style="color: var(--text-gray);">
                Placa: ${v.placa} • R$ ${parseFloat(v.preco_diario).toFixed(2)}/dia
              </span>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button onclick="editarVeiculo(${v.veiculo_id})" style="padding: 0.5rem 1rem; font-size: 0.9rem; background: var(--primary-blue); border: none; color: white; border-radius: 6px; cursor: pointer;">Editar</button>
              <button onclick="excluirVeiculo(${v.veiculo_id})" style="padding: 0.5rem 1rem; font-size: 0.9rem; background: #ef4444; border: none; color: white; border-radius: 6px; cursor: pointer;">Excluir</button>
            </div>
          </div>
        `;
        lista.appendChild(li);
      });
    })
    .catch(err => {
      console.error('Erro ao carregar veículos:', err);
      alert('Erro ao carregar veículos. Verifique se a API está rodando.');
    });
}

function cadastrarVeiculo(e) {
  e.preventDefault();
  const form = e.target;
  const veiculo = {
    marca: form.marca.value,
    modelo: form.modelo.value,
    ano: parseInt(form.ano.value),
    placa: form.placa.value,
    preco_diario: parseFloat(form.preco_diario.value)
  };

  const id = form.dataset.editandoId;
  const method = id ? 'PUT' : 'POST';
  const url = id ? `${API}/veiculos/${id}` : `${API}/veiculos`;

  fetch(url, {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(veiculo)
  })
    .then(res => {
      if (res.ok) {
        alert(id ? 'Veículo atualizado com sucesso!' : 'Veículo cadastrado com sucesso!');
        form.reset();
        delete form.dataset.editandoId;
        form.querySelector('button[type="submit"]').textContent = 'Cadastrar Veículo';
        carregarVeiculos();
      } else {
        alert('Erro ao salvar veículo.');
      }
    })
    .catch(err => {
      console.error('Erro:', err);
      alert('Erro ao salvar veículo. Verifique a conexão.');
    });
}

function editarVeiculo(id) {
  fetch(`${API}/veiculos`)
    .then(res => res.json())
    .then(veiculos => {
      const veiculo = veiculos.find(v => v.veiculo_id === id);
      if (!veiculo) return;

      const form = document.getElementById('form-veiculo');
      form.marca.value = veiculo.marca;
      form.modelo.value = veiculo.modelo;
      form.ano.value = veiculo.ano;
      form.placa.value = veiculo.placa;
      form.preco_diario.value = veiculo.preco_diario;
      form.dataset.editandoId = id;
      form.querySelector('button[type="submit"]').textContent = 'Atualizar Veículo';
      form.scrollIntoView({ behavior: 'smooth' });
    });
}

function excluirVeiculo(id) {
  if (!confirm('Deseja excluir este veículo?')) return;
  fetch(`${API}/veiculos/${id}`, { method: 'DELETE' })
    .then(res => {
      if (res.ok) {
        alert('Veículo excluído!');
        carregarVeiculos();
      } else {
        alert('Erro ao excluir veículo.');
      }
    })
    .catch(err => {
      console.error('Erro:', err);
      alert('Erro ao excluir veículo.');
    });
}

// ============= LOCAÇÕES =============
function carregarClientesSelect() {
  fetch(`${API}/clientes`)
    .then(res => res.json())
    .then(clientes => {
      const select = document.getElementById('select-cliente');
      if (!select) return;
      
      select.innerHTML = '<option value="">Selecione o Cliente</option>';
      clientes.forEach(c => {
        const option = document.createElement('option');
        option.value = c.cliente_id;
        option.textContent = `${c.nome} (${c.email})`;
        select.appendChild(option);
      });
    })
    .catch(err => console.error('Erro ao carregar clientes:', err));
}

function carregarVeiculosSelect() {
  fetch(`${API}/veiculos`)
    .then(res => res.json())
    .then(veiculos => {
      const select = document.getElementById('select-veiculo');
      if (!select) return;
      
      select.innerHTML = '<option value="">Selecione o Veículo</option>';
      veiculos.forEach(v => {
        const option = document.createElement('option');
        option.value = v.veiculo_id;
        option.textContent = `${v.marca} ${v.modelo} - ${v.placa} (R$ ${parseFloat(v.preco_diario).toFixed(2)}/dia)`;
        select.appendChild(option);
      });
    })
    .catch(err => console.error('Erro ao carregar veículos:', err));
}

function carregarLocacoes() {
  Promise.all([
    fetch(`${API}/locacoes`).then(res => res.json()),
    fetch(`${API}/clientes`).then(res => res.json()),
    fetch(`${API}/veiculos`).then(res => res.json())
  ])
    .then(([locacoes, clientes, veiculos]) => {
      const lista = document.getElementById('lista-locacoes');
      if (!lista) return;
      
      lista.innerHTML = '';
      
      if (locacoes.length === 0) {
        lista.innerHTML = '<li style="text-align: center; color: var(--text-gray);">Nenhuma locação cadastrada</li>';
        return;
      }
      
      locacoes.forEach(l => {
        const cliente = clientes.find(c => c.cliente_id === l.cliente_id);
        const veiculo = veiculos.find(v => v.veiculo_id === l.veiculo_id);
        const dataInicio = new Date(l.data_inicio).toLocaleString('pt-BR');
        const dataFim = new Date(l.data_fim).toLocaleString('pt-BR');
        
        const li = document.createElement('li');
        li.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: start;">
            <div>
              <strong>Locação #${l.locacao_id}</strong><br>
              <span style="color: var(--text-gray);">
                Cliente: ${cliente ? cliente.nome : 'ID ' + l.cliente_id}<br>
                Veículo: ${veiculo ? `${veiculo.marca} ${veiculo.modelo} (${veiculo.placa})` : 'ID ' + l.veiculo_id}<br>
                ${dataInicio} até ${dataFim}<br>
                <strong style="color: var(--accent-blue);">Valor: R$ ${parseFloat(l.valor).toFixed(2)}</strong>
              </span>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button onclick="editarLocacao(${l.locacao_id})" style="padding: 0.5rem 1rem; font-size: 0.9rem; background: var(--primary-blue); border: none; color: white; border-radius: 6px; cursor: pointer;">Editar</button>
              <button onclick="cancelarLocacao(${l.locacao_id})" style="padding: 0.5rem 1rem; font-size: 0.9rem; background: #ef4444; border: none; color: white; border-radius: 6px; cursor: pointer;">Cancelar</button>
            </div>
          </div>
        `;
        lista.appendChild(li);
      });
    })
    .catch(err => {
      console.error('Erro ao carregar locações:', err);
      alert('Erro ao carregar locações. Verifique se a API está rodando.');
    });
}

function cadastrarLocacao(e) {
  e.preventDefault();
  const form = e.target;
  const locacao = {
    cliente_id: parseInt(form.cliente_id.value),
    veiculo_id: parseInt(form.veiculo_id.value),
    data_inicio: form.data_inicio.value,
    data_fim: form.data_fim.value,
    valor: parseFloat(form.valor.value)
  };

  const id = form.dataset.editandoId;
  const method = id ? 'PUT' : 'POST';
  const url = id ? `${API}/locacoes/${id}` : `${API}/locacoes`;

  fetch(url, {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(locacao)
  })
    .then(res => {
      if (res.ok) {
        alert(id ? 'Locação atualizada com sucesso!' : 'Locação cadastrada com sucesso!');
        form.reset();
        delete form.dataset.editandoId;
        form.querySelector('button[type="submit"]').textContent = 'Cadastrar Locação';
        carregarLocacoes();
      } else {
        alert('Erro ao salvar locação.');
      }
    })
    .catch(err => {
      console.error('Erro:', err);
      alert('Erro ao salvar locação. Verifique a conexão.');
    });
}

function editarLocacao(id) {
  fetch(`${API}/locacoes`)
    .then(res => res.json())
    .then(locacoes => {
      const locacao = locacoes.find(l => l.locacao_id === id);
      if (!locacao) return;

      const form = document.getElementById('form-locacao');
      form.cliente_id.value = locacao.cliente_id;
      form.veiculo_id.value = locacao.veiculo_id;
      form.data_inicio.value = locacao.data_inicio.replace(' ', 'T').substring(0, 16);
      form.data_fim.value = locacao.data_fim.replace(' ', 'T').substring(0, 16);
      form.valor.value = locacao.valor;
      form.dataset.editandoId = id;
      form.querySelector('button[type="submit"]').textContent = 'Atualizar Locação';
      form.scrollIntoView({ behavior: 'smooth' });
    });
}

function cancelarLocacao(id) {
  if (!confirm('Deseja cancelar esta locação?')) return;
  fetch(`${API}/locacoes/${id}`, { method: 'DELETE' })
    .then(res => {
      if (res.ok) {
        alert('Locação cancelada!');
        carregarLocacoes();
      } else {
        alert('Erro ao cancelar locação.');
      }
    })
    .catch(err => {
      console.error('Erro:', err);
      alert('Erro ao cancelar locação.');
    });
}
