const API_URL = "http://localhost:8080";

const dateInput = document.getElementById("date");
const schedule = document.getElementById("schedule");
const timesContainer = document.getElementById("times");
const appointmentForm = document.getElementById("appointment-form");
const selectedDate = document.getElementById("selected-date");
const selectedTime = document.getElementById("selected-time");
const patientNameInput = document.getElementById("patient-name");
const confirmButton = document.getElementById("confirm-button");
const confirmation = document.getElementById("confirmation");
const confirmationMessage = document.getElementById("confirmation-message");
const message = document.getElementById("message");
const loading = document.getElementById("loading");

let selectedTimeValue = null;


// Quando o usuário escolhe uma data
dateInput.addEventListener("change", async () => {

    const date = dateInput.value;

    if (!date) {
        return;
    }

    limparTela();

    loading.classList.remove("hidden");

    try {

        await carregarHorarios();

    } catch (error) {

        mostrarErro(error.message);

    } finally {

        loading.classList.add("hidden");
    }
});


// Busca os horários disponíveis
async function carregarHorarios() {

    const date = dateInput.value;

    const response = await fetch(
        `${API_URL}/appointments/available?date=${date}`
    );

    if (!response.ok) {
        throw new Error("Erro ao consultar horários.");
    }

    const horarios = await response.json();

    mostrarHorarios(horarios);
}


// Mostra os horários disponíveis
function mostrarHorarios(horarios) {

    timesContainer.innerHTML = "";

    if (!horarios || horarios.length === 0) {

        schedule.classList.add("hidden");

        mostrarErro(
            "Não existem horários disponíveis para essa data."
        );

        return;
    }

    schedule.classList.remove("hidden");

    horarios.forEach(horario => {

        const button = document.createElement("button");

        button.type = "button";
        button.textContent = horario.substring(0, 5);
        button.classList.add("time-button");

        button.addEventListener("click", () => {
            selecionarHorario(horario, button);
        });

        timesContainer.appendChild(button);
    });
}


// Seleciona um horário
function selecionarHorario(horario, button) {

    selectedTimeValue = horario;

    // Esconde a confirmação do agendamento anterior
    confirmation.classList.add("hidden");
    confirmationMessage.textContent = "";

    document
        .querySelectorAll(".time-button")
        .forEach(button => {
            button.classList.remove("selected");
        });

    button.classList.add("selected");

    selectedDate.textContent =
        formatarData(dateInput.value);

    selectedTime.textContent =
        horario.substring(0, 5);

    appointmentForm.classList.remove("hidden");
}


// Confirma o agendamento
confirmButton.addEventListener("click", async () => {

    const patientName = patientNameInput.value.trim();

    if (!patientName) {
        mostrarErro("Informe o nome do paciente.");
        return;
    }

    if (!selectedTimeValue) {
        mostrarErro("Selecione um horário.");
        return;
    }

    const appointment = {
        patientName: patientName,
        date: dateInput.value,
        time: selectedTimeValue
    };

    try {

        confirmButton.disabled = true;
        confirmButton.textContent = "Agendando...";

        const response = await fetch(
            `${API_URL}/appointments`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(appointment)
            }
        );

        if (!response.ok) {

            let errorMessage =
                "Não foi possível realizar o agendamento.";

            try {

                const errorData = await response.json();

                if (errorData.message) {
                    errorMessage = errorData.message;
                }

            } catch (error) {
                // Resposta sem JSON
            }

            throw new Error(errorMessage);
        }

        const data = await response.json();

        mostrarConfirmacao(data);

        // Busca novamente os horários disponíveis
        await carregarHorarios();

        patientNameInput.value = "";

        selectedTimeValue = null;

    } catch (error) {

        mostrarErro(error.message);

    } finally {

        confirmButton.disabled = false;
        confirmButton.textContent = "Confirmar agendamento";
    }
});


// Mostra a confirmação
function mostrarConfirmacao(data) {

    confirmation.classList.remove("hidden");

    confirmationMessage.textContent =
        `Consulta de ${patientNameInput.value.trim()} agendada para ` +
        `${formatarData(dateInput.value)} às ` +
        `${selectedTimeValue.substring(0, 5)}.`;

    appointmentForm.classList.add("hidden");
}


// Formata a data
function formatarData(date) {

    const [year, month, day] = date.split("-");

    return `${day}/${month}/${year}`;
}


// Mostra mensagem de erro
function mostrarErro(texto) {

    message.textContent = texto;
    message.className = "error";
}


// Limpa informações anteriores
function limparTela() {

    message.textContent = "";
    message.className = "";

    schedule.classList.add("hidden");
    appointmentForm.classList.add("hidden");
    confirmation.classList.add("hidden");

    confirmationMessage.textContent = "";

    timesContainer.innerHTML = "";

    selectedTimeValue = null;
}