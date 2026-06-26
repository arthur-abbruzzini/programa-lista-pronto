const express = require("express");
const path = require("path");
const app = express();
const porta = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Array de tarefas para suportar ID e status de conclusão
let tarefas = [];

// Rota GET - Listar
app.get("/tarefas", function(req, res) {
    res.json(tarefas);
});

// Rota POST - Cadastrar
app.post("/tarefas", function(req, res) {
    const texto = req.body.texto;
    
    // Cria um objeto completo com ID único
    const novaTarefa = {
        id: Date.now(), // Gera um ID único para cada tarefa
        texto: texto,
        concluida: false
    };
    
    tarefas.push(novaTarefa);
    res.json({ mensagem: "Tarefa cadastrada!" });
});

// ROTA NOVA: PUT - Alternar entre concluída e pendente
app.put("/tarefas/:id", function(req, res) {
    const id = parseInt(req.params.id);
    
    // Encontra a tarefa pelo ID faz com que fique como concluída
    tarefas = tarefas.map(function(tarefa) {
        if (tarefa.id === id) {
            tarefa.concluida = !tarefa.concluida;
        }
        return tarefa;
    });
    
    res.json({ mensagem: "Status atualizado!" });
});

// Apaga uma tarefa específica pelo id
app.delete("/tarefas/:id", function(req, res) {
    const id = parseInt(req.params.id);
    
    // Filtra o array removendo a tarefa que possui o ID recebido
    tarefas = tarefas.filter(function(tarefa) {
        return tarefa.id !== id;
    });
    
    res.json({ mensagem: "Tarefa removida!" });
});

// configuração para o vercel e node local
if (process.env.NODE_ENV !== 'production') {
    app.listen(porta, function() {
        console.log(`Servidor rodando localmente em http://localhost:${porta}`);
    });
}

// Linha CRUCIAL para a Vercel funcionar:
module.exports = app;