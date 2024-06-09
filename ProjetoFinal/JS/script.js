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

        if (!db.objectStoreNames.contains('preferenciasNotificacoes')) {
            db.createObjectStore('preferenciasNotificacoes', { keyPath: 'tarefaId' });
        }
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        carregarTarefas();
    };

    formTarefa.addEventListener('submit', adicionarTarefa);





    const sidebar = document.getElementById('sidebar');
    const nomeUsuario = document.getElementById('nome-usuario');
    const iconeUsuario = nomeUsuario.querySelector('svg');
    const closeSidebarButton = document.getElementById('close-sidebar'); 

    // Abrir o sidebar
    nomeUsuario.addEventListener('click', openSidebar);
    iconeUsuario.addEventListener('click', openSidebar);

    // Fechar o sidebar
    closeSidebarButton.addEventListener('click', closeSidebar);

    document.addEventListener('click', function(event) {
        // Verifica se o clique foi fora do sidebar E fora do botão que o abre
        if (!sidebar.contains(event.target) && 
            !nomeUsuario.contains(event.target) && 
            sidebar.classList.contains('active')) {
            
            closeSidebar();
        }
    });

    function openSidebar() {
        sidebar.classList.add('active');
    }

    function closeSidebar() {
        sidebar.classList.remove('active');
    }

    const aboutButton = document.getElementById('about-button');
    aboutButton.addEventListener('click', function() {
        $('#modalAbout').modal('show');
    });






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
        listaTarefas.innerHTML = ''; // Limpa a lista antes de carregar as tarefas
      
        const transaction = db.transaction(['tarefas'], 'readonly');
        const objectStore = transaction.objectStore('tarefas');
        const request = objectStore.getAll();
      
        request.onsuccess = async function (event) {
          const tarefas = event.target.result;
      
          for (const tarefa of tarefas) { // Usando um loop for...of para usar await dentro dele
            const listItem = document.createElement('div');
            listItem.classList.add('list-group-item', `categoria-${tarefa.categoria}`);
            listItem.id = `tarefa-${tarefa.id}`; 
      
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
                  <i class="fas fa-check-square btn-concluir" data-tarefa-id="${tarefa.id}"></i>
                </div>
              </div>
            `;
      
            listaTarefas.appendChild(listItem);

            const iconeConcluir = listItem.querySelector('.btn-concluir');
            if (tarefa.status === 'concluido') {
                iconeConcluir.classList.remove('fa-check-square');
                iconeConcluir.classList.add('fa-undo');
            } else {
                iconeConcluir.classList.add('fa-check-square');
                iconeConcluir.classList.remove('fa-undo');
            }
      
            const iconeEditar = listItem.querySelector('.fa-edit');
            iconeEditar.addEventListener('click', abrirModalEditarTarefa);
      
            const iconeExcluir = listItem.querySelector('.fa-trash-alt');
            iconeExcluir.addEventListener('click', excluirTarefa);
      
            const botaoConcluir = listItem.querySelector('.btn-concluir');
            botaoConcluir.addEventListener('click', function () {
              const tarefaId = parseInt(this.dataset.tarefaId);
              concluirTarefa(tarefaId);
            });
      
            // Verificar se a tarefa está dentro do prazo e se deve ser notificada
            const tempoRestante = calcularTempoRestante(tarefa.data);
            if (tempoRestante <= 5 && tempoRestante >= 0) {
              try {
                const notificacaoDesativada = await verificarPreferenciaNotificacao(tarefa.id);
      
                if (!notificacaoDesativada) {
                  exibirNotificacao(tarefa);
                }
              } catch (error) {
                console.error('Erro ao verificar preferência:', error);
                exibirNotificacao(tarefa);
              }
            }
      
            // Impedir que o clique nos ícones se propague para o elemento pai
            const iconesAcao = listItem.querySelectorAll('.acoes i');
            iconesAcao.forEach(icone => {
              icone.addEventListener('click', function (event) {
                event.stopPropagation();
              });
            });
      
            // Adicionar evento de clique no item da lista para abrir o modal de visualização
            listItem.addEventListener('click', function (event) {
              if (event.target.classList.contains('fa-edit') || event.target.classList.contains('fa-trash-alt') || event.target.classList.contains('btn-concluir')) {
                return;
              }
      
              const tarefaClicada = tarefas.find(t => t.id === tarefa.id); // Encontra a tarefa correspondente
              if (tarefaClicada) {
                document.getElementById('visualizar-titulo').textContent = tarefaClicada.titulo;
                document.getElementById('visualizar-descricao').textContent = tarefaClicada.descricao;
                document.getElementById('visualizar-data').textContent = tarefaClicada.data ? tarefaClicada.data : 'Sem data';
                document.getElementById('visualizar-prioridade').textContent = tarefaClicada.prioridade;
                document.getElementById('visualizar-categoria').textContent = tarefaClicada.categoria;
                document.getElementById('visualizar-status').textContent = tarefaClicada.status;
      
                $('#modalVisualizarTarefa').modal('show');
              }
            });
          }
        };
      }

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

            status: buscarTarefaPorId(tarefaId).then(tarefa => {
                return tarefa ? tarefa.status : 'pendente'; // Retorna o status da tarefa ou 'pendente' se a tarefa não for encontrada
            })
            // ... outros campos que você quer atualizar
        };

        tarefaAtualizada.status.then(status => {
            tarefaAtualizada.status = status; 

            // Atualizar a tarefa no IndexedDB
            const transaction = db.transaction(['tarefas'], 'readwrite');
            const objectStore = transaction.objectStore('tarefas');
            const request = objectStore.put(tarefaAtualizada);

            request.onsuccess = function () {
                // Fechar o modal
                $('#modalEditarTarefa').modal('hide');

                // Atualizar a lista de tarefas na interface do usuário
                atualizarTarefaNaLista(tarefaAtualizada);


                const listItem = document.getElementById(`tarefa-${tarefaAtualizada.id}`);
                listItem.classList.remove('categoria-pessoal', 'categoria-profissional', 'categoria-academica'); 
                listItem.classList.add(`categoria-${tarefaAtualizada.categoria}`);
            };

            request.onerror = function (event) {
                console.error('Erro ao atualizar tarefa:', event.target.error);
            };
        });
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
            const statusElemento = listItem.querySelector('.status-pendente, .status-encerrada');

            const categoriaElemento = listItem.querySelector('.badge-primary'); // Seletor para o elemento da categoria
            categoriaElemento.textContent = tarefa.categoria;

            tituloElemento.textContent = tarefa.titulo;
            tituloElemento.className = `mb-1 ${tarefa.prioridade ? `prioridade-${tarefa.prioridade}` : ''}`; // Atualiza a classe de prioridade

            descricaoElemento.textContent = tarefa.descricao;
            dataElemento.textContent = `Data: ${tarefa.data ? tarefa.data : 'Sem data'}`;

            // Atualizar o status da tarefa
            statusElemento.className = `badge badge-pill ${tarefa.status === 'pendente' ? 'badge-danger status-pendente' : 'badge-success status-encerrada'}`;
            statusElemento.textContent = tarefa.status;

            if (tarefa.status === 'pendente') {
                statusElemento.classList.add('badge-danger', 'status-pendente');
                statusElemento.classList.remove('badge-success', 'status-encerrada');
                statusElemento.textContent = 'pendente';
              } else {
                statusElemento.classList.remove('badge-danger', 'status-pendente');
                statusElemento.classList.add('badge-success', 'status-encerrada');
                statusElemento.textContent = 'concluido';
              }

            listItem.classList.remove('categoria-pessoal', 'categoria-profissional', 'categoria-academica');

            listItem.classList.add(`categoria-${tarefa.categoria}`);

            // Atualizar a classe da categoria
            listItem.className = `list-group-item categoria-${tarefa.categoria}`;
        } else {
            console.error('Item da lista não encontrado para atualização.');
            // Lidar com o caso em que o item da lista não é encontrado (exibir mensagem de erro, etc.)
        }
    }

    function concluirTarefa(tarefaId) {
        const transaction = db.transaction(['tarefas'], 'readwrite');
        const objectStore = transaction.objectStore('tarefas');
      
        const request = objectStore.get(tarefaId);
      
        request.onsuccess = function(event) {
          const tarefa = event.target.result;
      
          if (tarefa) {
            // Alterna o status da tarefa
            tarefa.status = tarefa.status === 'pendente' ? 'concluido' : 'pendente';
      
            const requestUpdate = objectStore.put(tarefa);
      
            requestUpdate.onsuccess = function() {
              // Atualizar a interface do usuário
              const listItem = document.querySelector(`#lista-tarefas [data-tarefa-id="${tarefaId}"]`).parentNode.parentNode;
              const statusElemento = listItem.querySelector('.status-pendente, .status-encerrada');
              const iconeConcluir = listItem.querySelector('.btn-concluir'); 
      
              if (tarefa.status === 'concluido') {
                statusElemento.classList.remove('badge-danger', 'status-pendente');
                statusElemento.classList.add('badge-success', 'status-encerrada');
                statusElemento.textContent = 'concluido';
                iconeConcluir.classList.remove('fa-check-square'); 
                iconeConcluir.classList.add('fa-undo');        
              } else {
                statusElemento.classList.add('badge-danger', 'status-pendente');
                statusElemento.classList.remove('badge-success', 'status-encerrada');
                statusElemento.textContent = 'pendente';
                iconeConcluir.classList.add('fa-check-square'); 
                iconeConcluir.classList.remove('fa-undo');       
              }
            }
          }
        };
      }

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



    function verificarPreferenciaNotificacao(tarefaId) {
        return new Promise((resolve, reject) => {
          const transaction = db.transaction(['preferenciasNotificacoes'], 'readonly');
          const objectStore = transaction.objectStore('preferenciasNotificacoes');
          const request = objectStore.get(tarefaId);
      
          request.onsuccess = (event) => {
            const preferencia = event.target.result;
            resolve(preferencia && preferencia.naoNotificar ? true : false); 
          };
      
          request.onerror = (event) => {
            console.error('Erro ao verificar preferência de notificação:', event.target.error);
            reject(event.target.error);
          };
        });
    }

    function salvarPreferenciaNotificacao(tarefaId) {
        const transaction = db.transaction(['preferenciasNotificacoes'], 'readwrite');
        const objectStore = transaction.objectStore('preferenciasNotificacoes');
        const request = objectStore.put({ tarefaId: tarefaId, naoNotificar: true }); 
      
        request.onsuccess = (event) => {
          console.log(`Preferência para tarefa ${tarefaId} salva com sucesso!`);
        };
      
        request.onerror = (event) => {
          console.error('Erro ao salvar preferência de notificação:', event.target.error);
        };
    }

    function exibirNotificacao(tarefa) {
        const notificacaoDiv = document.getElementById('notificacao');
        const mensagemNotificacao = document.getElementById('notificacao-mensagem');
        const checkboxNaoNotificar = document.getElementById('nao-notificar-novamente');
        const botaoFechar = document.getElementById('fechar-notificacao');
      
        // Calcula o tempo restante em dias
        const tempoRestante = calcularTempoRestante(tarefa.data); 
      
        mensagemNotificacao.textContent = `A tarefa "${tarefa.titulo}" irá fechar em ${tempoRestante} dias.`;
      
        // Define o estado inicial da checkbox (desmarcado)
        checkboxNaoNotificar.checked = false;
      
        notificacaoDiv.style.display = 'block';
      
        // Adicionar evento para fechar a notificação
        botaoFechar.addEventListener('click', () => {
          notificacaoDiv.style.display = 'none';
        });
      
        // Lógica para salvar a preferência "Não notificar novamente"
        checkboxNaoNotificar.addEventListener('change', () => {
          if (checkboxNaoNotificar.checked) {
            salvarPreferenciaNotificacao(tarefa.id); // Chama a função para salvar no IndexedDB
            console.log(`Não notificar novamente sobre a tarefa ${tarefa.id}`);
          }
        });
    }
      
  function calcularTempoRestante(dataPrazo) {
    const hoje = new Date();
    const prazo = new Date(dataPrazo);
    const diffTempo = prazo.getTime() - hoje.getTime();
    const diffDias = Math.ceil(diffTempo / (1000 * 60 * 60 * 24)); 
    return diffDias;
  }
});