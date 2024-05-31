document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario-tarefa');
    const listaTarefas = document.getElementById('lista-tarefas');
  
    let tarefas = []; // Array para armazenar as tarefas

    let indiceEdicao = null; 
  
    // Carregar tarefas do localStorage (se houver)
    carregarTarefas();
  
    // Event Listener para adicionar nova tarefa
    formulario.addEventListener('submit', (event) => {
        event.preventDefault();
    
        if (indiceEdicao !== null) {
            // Editar tarefa existente
            tarefas[indiceEdicao] = {
                titulo: document.getElementById('titulo').value,
                descricao: document.getElementById('descricao').value,
                data: document.getElementById('data').value,
                prioridade: document.getElementById('prioridade').value,
                status: tarefas[indiceEdicao].status // Manter o status original
            };
            indiceEdicao = null; // Limpar o índice após a edição
            document.getElementById('btn-adicionar').textContent = 'Adicionar Tarefa';
        } else {
            // Adicionar nova tarefa (mesmo código de antes)
            const novaTarefa = { 
                // ... 
            };
            tarefas.push(novaTarefa);
        }
    
        salvarTarefas();
        renderizarTarefas();
        formulario.reset();
    });
  
    // Função para renderizar tarefas na lista
    function renderizarTarefas() {
        listaTarefas.innerHTML = ''; // Limpar a lista
  
        tarefas.forEach((tarefa, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${tarefa.titulo} - ${tarefa.data} - ${tarefa.prioridade}</span>
                <div>
                    <button class="editar" data-index="${index}">Editar</button>
                    <button class="concluir" data-index="${index}">Concluir</button>
                    <button class="excluir" data-index="${index}">Excluir</button>
                </div>
            `;
            listaTarefas.appendChild(li);
  
            // Adicionar classe para destacar tarefas próximas e urgentes
            const hoje = new Date();
            const dataTarefa = new Date(tarefa.data);
            const diffTempo = dataTarefa.getTime() - hoje.getTime();
            const diffDias = Math.ceil(diffTempo / (1000 * 3600 * 24));
  
            if (diffDias <= 3 && diffDias > 0) {
                li.classList.add("proxima");
            } else if (diffDias < 0) {
                li.classList.add("urgente");
            }
  
            // Adicionar evento de clique nos botões de editar, concluir e excluir
            adicionarEventosBotoes(li, index);
        });
    }
  
    // Função para adicionar eventos aos botões de editar, concluir e excluir
    function adicionarEventosBotoes(li, index) {
        const btnEditar = li.querySelector('.editar');
        const btnConcluir = li.querySelector('.concluir');
        const btnExcluir = li.querySelector('.excluir');
  
        btnEditar.addEventListener('click', () => {
            indiceEdicao = index;

            // Preencher o formulário com os dados da tarefa
            document.getElementById('titulo').value = tarefas[index].titulo;
            document.getElementById('descricao').value = tarefas[index].descricao;
            document.getElementById('data').value = tarefas[index].data;
            document.getElementById('prioridade').value = tarefas[index].prioridade;

            // Alterar texto do botão para "Salvar Edição"
            document.getElementById('btn-adicionar').textContent = 'Salvar Edição';
        });
  
        btnConcluir.addEventListener('click', () => {
            tarefas[index].status = (tarefas[index].status === 'pendente') ? 'concluida' : 'pendente';
            salvarTarefas();
            renderizarTarefas();
        });
  
        btnExcluir.addEventListener('click', () => {
            tarefas.splice(index, 1);
            salvarTarefas();
            renderizarTarefas();
        });
    }
  
    // Função para salvar as tarefas no localStorage
    function salvarTarefas() {
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
    }
  
    // Função para carregar as tarefas do localStorage
    function carregarTarefas() {
        const tarefasSalvas = localStorage.getItem('tarefas');
        if (tarefasSalvas) {
            tarefas = JSON.parse(tarefasSalvas);
            renderizarTarefas();
        }
    }
  });