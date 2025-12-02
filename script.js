const inputTask = document.getElementById('input-task');
const inputDate = document.getElementById('input-date'); // Novo seletor
const btnAdd = document.getElementById('btn-add');
const listTasks = document.getElementById('list-tasks');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks() {
    listTasks.innerHTML = '';

    // ORDENAÇÃO: Coloca tarefas com data primeiro, ordenadas da mais antiga para a mais nova
    tasks.sort((a, b) => {
        if (!a.date) return 1; // Se não tem data, vai pro final
        if (!b.date) return -1;
        return new Date(a.date) - new Date(b.date);
    });

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        if (task.completed) li.classList.add('done');

        // Div container para o texto e a data
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('task-content');
        contentDiv.onclick = () => toggleTask(index);

        // Texto da tarefa
        const textSpan = document.createElement('span');
        textSpan.classList.add('task-text');
        textSpan.textContent = task.text;

        contentDiv.appendChild(textSpan);

        if (task.date) {
            const dateSpan = document.createElement('span');
            dateSpan.classList.add('task-date');
            
            // Formata a data para BR
            const formattedDate = formatDateBR(task.date);
            dateSpan.textContent = `📅 ${formattedDate}`;

            // tarefas atrasadas
            const hoje = new Date().toISOString().split('T')[0];
            if (task.date < hoje && !task.completed) {
                dateSpan.classList.add('overdue');
                dateSpan.textContent += ' (Atrasado!)';
            }

            contentDiv.appendChild(dateSpan);
        }

        const btnDelete = document.createElement('button');
        btnDelete.textContent = 'Excluir';
        btnDelete.classList.add('btn-delete');
        btnDelete.onclick = () => removeTask(index);

        li.appendChild(contentDiv);
        li.appendChild(btnDelete);
        listTasks.appendChild(li);
    });
}

function addTask() {
    const text = inputTask.value.trim();
    const date = inputDate.value; 

    if (text === '') {
        alert('Por favor, digite uma tarefa!');
        return;
    }
    const newTask = {
        text: text,
        date: date || null, 
        completed: false
    };

    tasks.push(newTask);
    inputTask.value = '';
    inputDate.value = ''; // Limpa o campo de data também
    
    saveToLocalStorage();
    renderTasks();
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveToLocalStorage();
    renderTasks();
}

function removeTask(index) {
    tasks.splice(index, 1);
    saveToLocalStorage();
    renderTasks();
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function formatDateBR(dateString) {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

btnAdd.addEventListener('click', addTask);

inputTask.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

renderTasks();