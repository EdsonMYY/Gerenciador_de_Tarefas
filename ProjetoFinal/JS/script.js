document.addEventListener('DOMContentLoaded', function () {
    let db;
    const formTarefa = document.getElementById('form-tarefa');
    const listaTarefas = document.getElementById('lista-tarefas');

    // Inicializar o IndexedDB
    const request = indexedDB.open('gerenciadorTarefas', 1);

    request.onerror = function (event) {
        console.error('Erro ao abrir o IndexedDB:', event.target.errorCode);
    };

    request.onupgradeneeded = function (event) {
        db = event.target.result;
        const objectStore = db.createObjectStore('tarefas', { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('titulo', 'titulo', { unique: false });
        objectStore.createIndex('data', 'data', { unique: false });
        objectStore.createIndex('prioridade', 'prioridade', { unique: false });
        objectStore.createIndex('categoria', 'categoria', { unique: false });
        objectStore.createIndex('status', 'status', { unique: false }); // Adiciona o índice para status
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        carregarTarefas();
    };

    formTarefa.addEventListener('submit', adicionarTarefa);

    function adicionarTarefa(event) {
        event.preventDefault();

        const novaTarefa = {
            titulo: document.getElementById('titulo').value,
            descricao: document.getElementById('descricao').value,
            data: document.getElementById('data').value,
            prioridade: document.getElementById('prioridade').value,
            categoria: document.getElementById('categoria').value,
            status: 'pendente' 
        };

        const transaction = db.transaction(['tarefas'], 'readwrite');
        const objectStore = transaction.objectStore('tarefas');
        const request = objectStore.add(novaTarefa);

        request.onsuccess = function () {
            formTarefa.reset();
            carregarTarefas();
        };

        request.onerror = function (event) {
            console.error('Erro ao adicionar tarefa:', event.target.error);
        };
    }

    function carregarTarefas() {
        listaTarefas.innerHTML = '';

        const transaction = db.transaction(['tarefas'], 'readonly');
        const objectStore = transaction.objectStore('tarefas');
        const request = objectStore.getAll();

        request.onsuccess = function (event) {
            const tarefas = event.target.result;

            tarefas.forEach(tarefa => {
                const listItem = document.createElement('div');
                listItem.classList.add('list-group-item', `categoria-${tarefa.categoria}`);

                // Adicionando informações da tarefa
                listItem.innerHTML = `
                <div>
                    <h5 class="mb-1 ${tarefa.prioridade ? `prioridade-${tarefa.prioridade}` : ''}">${tarefa.titulo}</h5>
                    <p class="mb-1">${tarefa.descricao}</p>
                    <small>Data: ${tarefa.data ? tarefa.data : 'Sem data'}</small> 
                    <small>Categoria: <span class="badge badge-pill badge-primary">${tarefa.categoria}</span></small> 
                    <small>Status: <span class="badge badge-pill ${tarefa.status === 'pendente' ? 'badge-danger status-pendente' : 'badge-success status-encerrada'}">${tarefa.status}</span></small> 
                    <div class="acoes">
                    <i class="fas fa-edit"></i> 
                    <i class="fas fa-trash-alt" data-tarefa-id="${tarefa.id}"></i> 
                    </div>
                </div>
                `;

                listaTarefas.appendChild(listItem);

                // Adicionar evento de click no ícone de edição
                const iconeEditar = listItem.querySelector('.fa-edit');
                iconeEditar.addEventListener('click', abrirModalEditarTarefa);

                // Adicionar evento de click no ícone de lixeira (excluir)
                const iconeExcluir = listItem.querySelector('.fa-trash-alt');
                iconeExcluir.addEventListener('click', excluirTarefa);
            });
        };
    }

    //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    function buscarTarefaPorId(id) {
        let tarefaEncontrada = null; 
      
        const transaction = db.transaction(['tarefas'], 'readonly');
        const objectStore = transaction.objectStore('tarefas');
      
        // Usando get() para buscar por chave primária (ID)
        const request = objectStore.get(id);
      
        request.onsuccess = function(event) {
          tarefaEncontrada = event.target.result;
        };
      
        request.onerror = function(event) {
          console.error('Erro ao buscar tarefa:', event.target.error);
        };
      
        // A transação é assíncrona, então precisamos retornar a tarefaEncontrada
        // após a conclusão da transação. Uma solução é usar uma Promise:
        return new Promise((resolve, reject) => {
          transaction.oncomplete = function() {
            resolve(tarefaEncontrada);
          };
      
          transaction.onerror = function(event) {
            reject(event.target.error);
          };
        });
      }

    function abrirModalEditarTarefa(event) {
        const listItem = event.target.parentNode.parentNode;
        const tarefaId = parseInt(listItem.querySelector('.fa-trash-alt').dataset.tarefaId);

        // Função para buscar a tarefa no IndexedDB pelo ID
        buscarTarefaPorId(tarefaId)
            .then(tarefa => {
                if (tarefa) {
                    // Preencher o modal APENAS depois que a Promise for resolvida
                    document.getElementById('editar-id-tarefa').value = tarefa.id;
                    document.getElementById('editar-titulo').value = tarefa.titulo;
                    document.getElementById('editar-descricao').value = tarefa.descricao;
                    document.getElementById('editar-data').value = tarefa.data;
                    document.getElementById('editar-prioridade').value = tarefa.prioridade;
                    document.getElementById('editar-categoria').value = tarefa.categoria;

                    // Abrir o modal
                    $('#modalEditarTarefa').modal('show');
                } else {
                    console.error('Tarefa não encontrada.');
                    // Lidar com o caso em que a tarefa não é encontrada 
                }
            })
            .catch(error => {
                console.error('Erro ao buscar tarefa:', error);
                // Lidar com o erro
            });
    }

    // Adicionar evento de submit ao formulário de edição
    const formEditarTarefa = document.getElementById('form-editar-tarefa');
    formEditarTarefa.addEventListener('submit', editarTarefa);

    function editarTarefa(event) {
        event.preventDefault();

        const tarefaId = parseInt(document.getElementById('editar-id-tarefa').value);

        // Obter os valores atualizados do formulário de edição
        const tarefaAtualizada = {
            id: tarefaId,
            titulo: document.getElementById('editar-titulo').value,
            descricao: document.getElementById('editar-descricao').value,
            data: document.getElementById('editar-data').value,
            prioridade: document.getElementById('editar-prioridade').value,
            categoria: document.getElementById('editar-categoria').value,
            // ... outros campos que você quer atualizar
        };

        // Atualizar a tarefa no IndexedDB
        const transaction = db.transaction(['tarefas'], 'readwrite');
        const objectStore = transaction.objectStore('tarefas');
        const request = objectStore.put(tarefaAtualizada);

        request.onsuccess = function () {
            // Fechar o modal
            $('#modalEditarTarefa').modal('hide');

            // Atualizar a lista de tarefas na interface do usuário
            atualizarTarefaNaLista(tarefaAtualizada);
        };

        request.onerror = function (event) {
            console.error('Erro ao atualizar tarefa:', event.target.error);
        };
    }

    // Função para atualizar a tarefa na lista da interface do usuário
    function atualizarTarefaNaLista(tarefa) {
        // Encontrar o item da lista (listItem) pelo ID da tarefa
        const listItem = document.querySelector(`#lista-tarefas .list-group-item:has([data-tarefa-id="${tarefa.id}"])`);

        // Verificar se o elemento foi encontrado
        if (listItem) {
            // Atualizar o conteúdo do item da lista
            const tituloElemento = listItem.querySelector('h5');
            const descricaoElemento = listItem.querySelector('p');
            const dataElemento = listItem.querySelector('small');
            const statusElemento = listItem.querySelector('.status-pendente');

            tituloElemento.textContent = tarefa.titulo;
            tituloElemento.className = `mb-1 ${tarefa.prioridade ? `prioridade-${tarefa.prioridade}` : ''}`; // Atualiza a classe de prioridade

            descricaoElemento.textContent = tarefa.descricao;
            dataElemento.textContent = `Data: ${tarefa.data ? tarefa.data : 'Sem data'}`;

            // Atualizar o status da tarefa
            statusElemento.className = `badge badge-pill ${tarefa.status === 'pendente' ? 'badge-danger status-pendente' : 'badge-success status-encerrada'}`;
            statusElemento.textContent = tarefa.status;

            // Atualizar a classe da categoria
            listItem.className = `list-group-item categoria-${tarefa.categoria}`;
        } else {
            console.error('Item da lista não encontrado para atualização.');
            // Lidar com o caso em que o item da lista não é encontrado (exibir mensagem de erro, etc.)
        }
    }

    //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    function excluirTarefa(event) {
        const tarefaId = parseInt(event.target.dataset.tarefaId);
        const transaction = db.transaction(['tarefas'], 'readwrite');
        const objectStore = transaction.objectStore('tarefas');
        const request = objectStore.delete(tarefaId);

        request.onsuccess = function () {
            // Remover o item da lista 
            event.target.parentNode.parentNode.remove();
        };
    }
});