// Dados
let tasks = JSON.parse(localStorage.getItem('habitus_tasks')) || [];
let xp = parseInt(localStorage.getItem('habitus_xp')) || 0;
let streak = parseInt(localStorage.getItem('habitus_streak')) || 12;

// Onboarding
let currentSlide = 1;

function showSlide(n) {
    document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
    document.getElementById(`slide${n}`).classList.add('active');
    
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i+1 === n);
    });
}

function nextSlide() {
    if (currentSlide < 4) {
        currentSlide++;
        showSlide(currentSlide);
    }
}

function prevSlide() {
    if (currentSlide > 1) {
        currentSlide--;
        showSlide(currentSlide);
    }
}

function goToSlide(n) {
    currentSlide = n;
    showSlide(n);
}

function finishOnboarding() {
    localStorage.setItem('habitus_onboarded', 'true');
    document.getElementById('onboarding').style.display = 'none';
    document.getElementById('main-app').classList.remove('hidden');
    initApp();
}

function skipOnboarding() {
    if (confirm("Quer pular a introdução?")) finishOnboarding();
}

// App principal
function initApp() {
    document.getElementById('streak-count').textContent = streak;
    updateProgress();
    renderTasks();
}

function updateProgress() {
    const completed = tasks.filter(t => t.completed).length;
    const percent = tasks.length ? Math.round((completed / tasks.length) * 100) : 25;
    document.getElementById('progress-fill').style.width = percent + '%';
    document.getElementById('xp-today').textContent = xp % 500 || 45;
    document.getElementById('level').textContent = Math.floor(xp / 500) + 1;
}

function renderTasks() {
    const container = document.getElementById('task-list');
    container.innerHTML = '';

    if (tasks.length === 0) {
        container.innerHTML = `<div class="text-center text-gray-500 py-12">Nenhuma tarefa ainda. Adicione sua primeira!</div>`;
        return;
    }

    tasks.forEach((task, index) => {
        const div = document.createElement('div');
        div.className = `task-item ${task.completed ? 'completed' : ''}`;
        div.innerHTML = `
            <input type="checkbox" \( {task.completed ? 'checked' : ''} onchange="toggleTask( \){index})" class="w-6 h-6 accent-emerald-400">
            <div class="flex-1">
                <div class="font-medium">${task.title}</div>
                \( {task.time ? `<div class="text-xs text-gray-500"> \){task.time}</div>` : ''}
            </div>
            <div class="text-emerald-400 font-bold">+${task.xp || 25}xp</div>
        `;
        container.appendChild(div);
    });
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    if (tasks[index].completed) xp += tasks[index].xp || 25;
    localStorage.setItem('habitus_tasks', JSON.stringify(tasks));
    localStorage.setItem('habitus_xp', xp);
    updateProgress();
    renderTasks();
}

function addTask() {
    const title = prompt("Qual a tarefa?");
    if (!title) return;
    const time = prompt("Horário (ex: 08:00)") || "";
    tasks.push({ title, time, completed: false, xp: 25 });
    localStorage.setItem('habitus_tasks', JSON.stringify(tasks));
    renderTasks();
    updateProgress();
}

function startPomodoro() { alert("Pomodoro iniciado (25 minutos) - funcionalidade completa em breve!"); }
function showHeatmap() { alert("Heatmap de consistência em breve"); }
function openJournal() { alert("Journal do dia em breve"); }

// Inicialização
if (localStorage.getItem('habitus_onboarded') === 'true') {
    document.getElementById('onboarding').style.display = 'none';
    document.getElementById('main-app').classList.remove('hidden');
    initApp();
} else {
    showSlide(1);
}

// PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}
