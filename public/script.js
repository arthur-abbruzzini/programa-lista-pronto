const formulario = document.querySelector("#formulario");
const input = document.querySelector("#tarefa");
const lista = document.querySelector("#lista");
const mensagem = document.querySelector("#mensagem");

// Função para buscar e renderizar as tarefas
async function carregarTarefas() {
    const resposta = await fetch("/tarefas");
    const tarefas = await resposta.json();

    lista.innerHTML = "";

    tarefas.forEach(function(tarefa) {
        const item = document.createElement("li");
        
        // Texto da tarefa
        const textoTarefa = document.createElement("span");
        textoTarefa.textContent = tarefa.texto;
        item.appendChild(textoTarefa);
        
        //  DATA: Gera a data de inclusão baseada no ID (que já guarda os milissegundos de quando foi criada)
        const dataInclusao = document.createElement("span");
        dataInclusao.className = "data-tarefa";
        dataInclusao.textContent = new Date(tarefa.id).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
        item.appendChild(dataInclusao);
        
        // Se a tarefa estiver concluída no servidor, adiciona a classe CSS correspondente
        if (tarefa.concluida) {
            item.classList.add("comprado"); 
        }

        // Clicar para Concluir/Riscar
        item.addEventListener("click", async function() {
            await fetch(`/tarefas/${tarefa.id}`, { method: "PUT" });
            carregarTarefas();
        });

        // Botão de Apagar 
        const botaoRemover = document.createElement("button");
        botaoRemover.textContent = "Remover";
        botaoRemover.className = "btn-remover"; 

        botaoRemover.addEventListener("click", async function(evento) {
            evento.stopPropagation(); 
            await fetch(`/tarefas/${tarefa.id}`, { method: "DELETE" });
            carregarTarefas();
        });

        item.appendChild(botaoRemover);
        lista.appendChild(item);
    });
}

// Enviar formulário (POST)
formulario.addEventListener("submit", async function(evento) {
    evento.preventDefault();
    const texto = input.value.trim();

    if (texto === "") {
        mensagem.textContent = "Digite uma tarefa!";
        return;
    }

    await fetch("/tarefas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: texto })
    });

    mensagem.textContent = "Tarefa adicionada!";
    input.value = "";
    input.focus();

    carregarTarefas();
});

carregarTarefas();