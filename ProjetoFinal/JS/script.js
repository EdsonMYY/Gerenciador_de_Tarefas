document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario-tarefa');
    const listaPessoal = document.getElementById('lista-tarefas-pessoal');
    const listaProfissional = document.getElementById('lista-tarefas-profissional');
    const listaAcademica = document.getElementById('lista-tarefas-academica');

    // Controles do Modal (Pop-up)
    const modal = document.getElementById("modal-tarefa");
    const btnAbrirModal = document.getElementById("abrir-modal");
    const btnFecharModal = document.querySelector(".fechar-modal");

    let tarefas = []; // Array para armazenar as tarefas
    let indiceEdicao = null;

    // Abrir o modal
    btnAbrirModal.addEventListener("click", () => {
        modal.style.display = "block";
    });

    // Fechar o modal
    btnFecharModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Fechar o modal ao clicar fora do conteúdo
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

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
                categoria: document.getElementById('categoria').value,
                status: tarefas[indiceEdicao].status // Manter o status original
            };
            indiceEdicao = null; // Limpar o índice após a edição
            document.getElementById('btn-adicionar').textContent = 'Adicionar Tarefa';
        } else {
            // Adicionar nova tarefa 
            const novaTarefa = {
                titulo: document.getElementById('titulo').value,
                descricao: document.getElementById('descricao').value,
                data: document.getElementById('data').value,
                prioridade: document.getElementById('prioridade').value,
                categoria: document.getElementById('categoria').value,
                status: 'pendente'
            };
            tarefas.push(novaTarefa);
        }

        salvarTarefas();
        renderizarTarefas();
        formulario.reset();
        modal.style.display = "none"; // Fechar o modal após adicionar/editar
    });

    // Função para renderizar tarefas na lista
    function renderizarTarefas() {
        // Limpar as listas antes de renderizar
        listaPessoal.innerHTML = '';
        listaProfissional.innerHTML = '';
        listaAcademica.innerHTML = '';

        tarefas.forEach((tarefa, index) => {
            const li = document.createElement('li');

            li.innerHTML = ''; // Limpa o conteúdo HTML existente antes de adicionar o novo
            // Criar elemento para o ícone de status
            const iconeStatus = document.createElement('i');

            // Task Card Structure
            const taskCard = document.createElement('div');
            taskCard.classList.add('task-card', tarefa.prioridade); // Add priority as a class

            if (tarefa.status === 'pendente') {
                iconeStatus.classList.add('fas', 'fa-clock', 'pendente'); // Ícone de relógio para pendente
            } else {
                iconeStatus.classList.add('fas', 'fa-check-circle', 'concluida'); // Ícone de círculo com check para concluída
            }
            li.appendChild(iconeStatus); // Adicionar o ícone ao li

            // Adicione o span e os botões usando innerHTML
            taskCard.innerHTML += `
                <span class="titulo">${tarefa.titulo}</span>
                <span class="data">${tarefa.data}</span>
                <span class="categoria">${tarefa.categoria}</span> 
                <span class="descricao">${tarefa.descricao}</span> <div>
                <button class="editar" data-index="${index}">Editar</button>
                <button class="concluir" data-index="${index}">Concluir</button>
                <button class="excluir" data-index="${index}">Excluir</button>
            </div>
            `; 
            li.appendChild(taskCard)

            // Adicionar a tarefa à coluna correta
            if (tarefa.categoria === 'Pessoal') {
                listaPessoal.appendChild(li);
            } else if (tarefa.categoria === 'Profissional') {
                listaProfissional.appendChild(li);
            } else if (tarefa.categoria === 'Acadêmica') {
                listaAcademica.appendChild(li);
            }

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
            document.getElementById('categoria').value = tarefas[index].categoria;

            // Abrir o modal de edição
            modal.style.display = "block"; 

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