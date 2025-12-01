const inputNome = document.getElementById("nome");
const inputData = document.getElementById("data");
const inputValor = document.getElementById("valor");
const btnAdd = document.getElementById("btnAdd");
const div_meio = document.getElementById("meio");
const totalAtendidos = document.getElementById("totalAtendidos"); // span do total

// ------------------ Tratamento do valor ------------------
inputValor.addEventListener("focus", () => {
    if (inputValor.value.trim() === "") {
        inputValor.value = "0,00";
    }
});

inputValor.addEventListener("input", () => {
    // Remove tudo que não for número
    let valor = inputValor.value.replace(/\D/g, "");

    // Garante pelo menos 3 dígitos (para centavos)
    while (valor.length < 3) {
        valor = "0" + valor;
    }

    // Separa centavos e reais
    const centavos = valor.slice(-2);
    const reais = valor.slice(0, -2);

    // Atualiza o input com o valor formatado
    inputValor.value = `${parseInt(reais, 10)},${centavos}`;
});

// ------------------ Função para atualizar total ------------------
function atualizarTotal() {
    let total = 0;
    const pacientes = document.querySelectorAll(".novoPaciente");
    pacientes.forEach(p => {
        if (p.dataset.status === "atendido") {
            total += Number(p.dataset.valor);
        }
    });
    totalAtendidos.textContent = total.toFixed(2);
}
//criar função para salvar no localstorage
function salvarPacientes() {
    const pacientes = [];

    document.querySelectorAll(".novoPaciente").forEach(div => {
        pacientes.push({
            nome: div.querySelector("span:nth-child(1)").textContent.replace("Nome: ", ""),
            data: div.querySelector("span:nth-child(2)").textContent.replace("Data: ", ""),
            valor: parseFloat(div.dataset.valor),
            status: div.dataset.status
        });
    });

    localStorage.setItem("pacientes", JSON.stringify(pacientes));
}


// ------------------ Adicionar paciente ------------------
btnAdd.addEventListener("click", () => {
    if(inputNome.value === "") return alert("Digite um nome para adicionar!");

    const nome = inputNome.value.trim();
    const data = inputData.value.trim();

    // Converte o valor do input para número
    let valor = parseFloat(inputValor.value.replace(",", "."));

    // Verifica se é um número válido
    if (isNaN(valor)) {
        alert("Digite um valor numérico válido!");
        return;
    }

    // Garante duas casas decimais
    valor = valor.toFixed(2);

    // Cria a div do paciente
    const div = document.createElement("div");
    div.classList.add("novoPaciente");
    div.dataset.valor = valor;  // armazenar valor no dataset
    div.dataset.status = "pendente"; // status inicial

    // Cria spans
    const spanNome = document.createElement("span");
    spanNome.textContent = `Nome: ${nome}`;

    const spanData = document.createElement("span");
    spanData.textContent = `Data: ${data}`;

    const spanValor = document.createElement("span");
    spanValor.textContent = `Valor: R$ ${valor}`;

    // Cria botões
    const btnAtendido = document.createElement("button");
    btnAtendido.textContent = "Atendido";
    btnAtendido.style.backgroundColor = "#4CAF50";
    btnAtendido.onclick = () => {
        div.style.backgroundColor = "#d4edda";
        div.dataset.status = "atendido";
        atualizarTotal();
        salvarPacientes();

    }

    const btnCancel = document.createElement("button");
    btnCancel.textContent = "Cancelado";
    btnCancel.style.backgroundColor = "#f44336";
    btnCancel.onclick = () => {
        div.style.backgroundColor = "#f8d7da";
        div.dataset.status = "cancelado";
        atualizarTotal();
        salvarPacientes();

    }

    const btnRemove = document.createElement("button");
    btnRemove.textContent = "Remover";
    btnRemove.style.backgroundColor = "#9E9E9E";
    btnRemove.onclick = () => {
        div.remove();
        atualizarTotal();
        salvarPacientes();

    }

    // Adiciona elementos na div
    div.append(spanNome, spanData, spanValor, btnAtendido, btnCancel, btnRemove);
    div_meio.appendChild(div);
    salvarPacientes();


    // Limpa inputs
    inputNome.value = "";
    inputData.value = "";
    inputValor.value = "";
});

function carregarPacientes() {
    const pacientesSalvos = JSON.parse(localStorage.getItem("pacientes")) || [];

    pacientesSalvos.forEach(p => {
        const div = document.createElement("div");
        div.classList.add("novoPaciente");
        div.dataset.valor = p.valor;
        div.dataset.status = p.status;

        // Cores de status
        if (p.status === "atendido") div.style.backgroundColor = "#d4edda";
        if (p.status === "cancelado") div.style.backgroundColor = "#f8d7da";

        const spanNome = document.createElement("span");
        spanNome.textContent = `Nome: ${p.nome}`;

        const spanData = document.createElement("span");
        spanData.textContent = `Data: ${p.data}`;

        const spanValor = document.createElement("span");
        spanValor.textContent = `Valor: R$ ${p.valor}`;

        // Botões
        const btnAtendido = document.createElement("button");
        btnAtendido.textContent = "Atendido";
        btnAtendido.style.backgroundColor = "#4CAF50";
        btnAtendido.onclick = () => {
            div.style.backgroundColor = "#d4edda";
            div.dataset.status = "atendido";
            atualizarTotal();
            salvarPacientes();
        }

        const btnCancel = document.createElement("button");
        btnCancel.textContent = "Cancelado";
        btnCancel.style.backgroundColor = "#f44336";
        btnCancel.onclick = () => {
            div.style.backgroundColor = "#f8d7da";
            div.dataset.status = "cancelado";
            atualizarTotal();
            salvarPacientes();
        }

        const btnRemove = document.createElement("button");
        btnRemove.textContent = "Remover";
        btnRemove.style.backgroundColor = "#9E9E9E";
        btnRemove.onclick = () => {
            div.remove();
            atualizarTotal();
            salvarPacientes();
        }

        div.append(spanNome, spanData, spanValor, btnAtendido, btnCancel, btnRemove);
        div_meio.appendChild(div);
    });

    atualizarTotal();
}
window.addEventListener("load", carregarPacientes);
