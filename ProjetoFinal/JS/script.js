document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario-tarefa');
    const listaTarefas = document.getElementById('lista-tarefas');
  
    let tarefas = []; // Array para armazenar as tarefas
  
    // Carregar tarefas do localStorage (se houver)
    carregarTarefas();
  
    // Event Listener para adicionar nova tarefa
    formulario.addEventListener('submit', (event) => {
        event.preventDefault();
  
        const novaTarefa = {
            titulo: document.getElementById('titulo').value,
            descricao: document.getElementById('descricao').value,
            data: document.getElementById('data').value,
            prioridade: document.getElementById('prioridade').value,
            status: 'pendente'
        };
  
        tarefas.push(novaTarefa);
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
            // Lógica para editar a tarefa
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