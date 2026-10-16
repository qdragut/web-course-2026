// --- 1. СОСТОЯНИЕ (State) ---
// Массив объектов для хранения задач
let tasks = []; 
// Текущий фильтр: 'all', 'active' или 'completed'
let currentFilter = 'all';
// Счётчик для уникальных ID
let nextId = 1;

// --- 2. ССЫЛКИ НА DOM-ЭЛЕМЕНТЫ ---
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const counter = document.getElementById('counter');
const filterButtons = document.querySelectorAll('.filter-btn');

// --- 3. ФУНКЦИИ ---

// Функция добавления задачи
function addTask() {
    const text = taskInput.value.trim(); // .trim() убирает лишние пробелы по краям
    
    // Проверка на пустую строку
    if (text === '') {
        alert('Введите текст задачи!');
        return;
    }

    // Создаём объект задачи
    const newTask = {
        id: nextId,
        text: text,
        completed: false
    };

    nextId++; // Увеличиваем счётчик ID
    tasks.push(newTask); // Добавляем в массив
    taskInput.value = ''; // Очищаем поле ввода
    
    render(); // Перерисовываем список
}

// Функция переключения статуса (выполнено/не выполнено)
function toggleTask(id) {
    // Находим задачу по ID и меняем её свойство completed на противоположное
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        render();
    }
}

// Функция удаления задачи
function deleteTask(id) {
    // Оставляем в массиве только те задачи, у которых id не совпадает с переданным
    tasks = tasks.filter(t => t.id !== id);
    render();
}

// Функция обновления счётчика
function updateCounter() {
    const activeCount = tasks.filter(t => !t.completed).length;
    const completedCount = tasks.filter(t => t.completed).length;
    counter.textContent = `Осталось: ${activeCount}, Выполнено: ${completedCount}`;
}

// Главная функция отрисовки (рендера)
function render() {
    // 1. Очищаем список
    taskList.innerHTML = '';

    // 2. Фильтруем задачи в зависимости от выбранного фильтра
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true; // Для 'all' возвращаем все задачи
    });

    // 3. Генерируем HTML для каждой задачи и вставляем в список
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        // Если задача выполнена, добавляем класс completed
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        // Формируем внутреннюю структуру
        li.innerHTML = `
            <span class="task-text">${task.text}</span>
            <div class="task-actions">
                <button class="toggle-btn" data-id="${task.id}">
                    ${task.completed ? 'Вернуть' : 'Выполнено'}
                </button>
                <button class="delete-btn" data-id="${task.id}">Удалить</button>
            </div>
        `;
        
        taskList.appendChild(li);
    });

    // 4. Обновляем счётчик
    updateCounter();
}

// --- 4. ОБРАБОТЧИКИ СОБЫТИЙ ---

// Добавление по клику на кнопку
addBtn.addEventListener('click', addTask);

// Добавление по нажатию клавиши Enter в поле ввода
taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Обработка кликов по фильтрам
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Убираем класс active у всех кнопок
        filterButtons.forEach(b => b.classList.remove('active'));
        // Добавляем класс active текущей кнопке
        btn.classList.add('active');
        
        // Меняем текущий фильтр
        currentFilter = btn.dataset.filter; 
        render(); // Перерисовываем список
    });
});

// Делегирование событий для кнопок внутри списка задач
// Это лучше, чем вешать обработчик на каждую кнопку, так как задачи динамически создаются и удаляются
taskList.addEventListener('click', (e) => {
    // Проверяем, кликнули ли мы по кнопке
    if (e.target.tagName === 'BUTTON') {
        const id = Number(e.target.dataset.id); // Получаем ID из data-атрибута
        
        if (e.target.classList.contains('toggle-btn')) {
            toggleTask(id);
        } else if (e.target.classList.contains('delete-btn')) {
            deleteTask(id);
        }
    }
});

// Первый запуск отрисовки (чтобы отобразить пустой список и счётчик)
render();