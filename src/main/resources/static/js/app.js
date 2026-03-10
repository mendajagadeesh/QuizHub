// ===== API Base URL =====
const API = '';

// ===== State =====
let allQuestions = [];
let currentQuizId = null;
let quizQuestions = [];

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    loadDashboard();
});

// ===== Navigation =====
function setupNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const view = link.dataset.view;
            showView(view);
            navLinks.classList.remove('open');
        });
    });
}

function showView(viewName) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewName + '-view').classList.add('active');

    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    const navLink = document.querySelector(`.nav-links a[data-view="${viewName}"]`);
    if (navLink) navLink.classList.add('active');

    if (viewName === 'home') loadDashboard();
    if (viewName === 'questions') loadQuestions();
    if (viewName === 'create-quiz') loadCategoriesForQuiz();
}

// ===== Dashboard =====
async function loadDashboard() {
    try {
        const res = await fetch(`${API}/api/questions/allQuestions`);
        if (!res.ok) return;
        const questions = await res.json();
        allQuestions = questions;

        document.getElementById('total-questions').textContent = questions.length;

        const categories = new Set(questions.map(q => q.category));
        document.getElementById('total-categories').textContent = categories.size;

        const difficulties = new Set(questions.map(q => q.difficultyLevel));
        document.getElementById('difficulty-levels').textContent = difficulties.size;
    } catch (e) {
        console.error('Failed to load dashboard:', e);
    }
}

// ===== Questions Management =====
async function loadQuestions() {
    try {
        const res = await fetch(`${API}/api/questions/allQuestions`);
        if (!res.ok) return;
        const questions = await res.json();
        allQuestions = questions;
        renderQuestions(questions);
        populateCategoryFilter(questions);
    } catch (e) {
        console.error('Failed to load questions:', e);
    }
}

function renderQuestions(questions) {
    // Table view
    const tbody = document.getElementById('questions-table-body');
    tbody.innerHTML = questions.map(q => `
        <tr>
            <td>${q.id}</td>
            <td>${escapeHtml(q.questionTitle)}</td>
            <td><span class="badge badge-category">${escapeHtml(q.category)}</span></td>
            <td><span class="badge badge-difficulty">${escapeHtml(q.difficultyLevel)}</span></td>
            <td>
                <div class="action-btns">
                    <button class="btn btn-primary btn-sm" onclick="openEditQuestionModal(${q.id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteQuestion(${q.id})">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');

    // Card view (mobile)
    const cards = document.getElementById('questions-cards');
    cards.innerHTML = questions.map(q => `
        <div class="question-card">
            <div class="card-header">
                <span class="card-id">#${q.id}</span>
                <div class="action-btns">
                    <button class="btn btn-primary btn-sm" onclick="openEditQuestionModal(${q.id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteQuestion(${q.id})">Delete</button>
                </div>
            </div>
            <div class="card-title">${escapeHtml(q.questionTitle)}</div>
            <div class="card-meta">
                <span class="badge badge-category">${escapeHtml(q.category)}</span>
                <span class="badge badge-difficulty">${escapeHtml(q.difficultyLevel)}</span>
            </div>
        </div>
    `).join('');
}

function populateCategoryFilter(questions) {
    const categories = [...new Set(questions.map(q => q.category))];
    const select = document.getElementById('category-filter');
    select.innerHTML = '<option value="all">All Categories</option>' +
        categories.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
}

async function filterQuestions() {
    const category = document.getElementById('category-filter').value;
    if (category === 'all') {
        renderQuestions(allQuestions);
    } else {
        try {
            const res = await fetch(`${API}/api/questions/category/${encodeURIComponent(category)}`);
            if (!res.ok) return;
            const questions = await res.json();
            renderQuestions(questions);
        } catch (e) {
            console.error('Failed to filter questions:', e);
        }
    }
}

// ===== Add/Edit Question Modal =====
function openAddQuestionModal() {
    document.getElementById('modal-title').textContent = 'Add Question';
    document.getElementById('modal-submit-btn').textContent = 'Add Question';
    document.getElementById('question-form').reset();
    document.getElementById('q-id').value = '';
    document.getElementById('question-modal').classList.remove('hidden');
}

function openEditQuestionModal(id) {
    const q = allQuestions.find(q => q.id === id);
    if (!q) return;

    document.getElementById('modal-title').textContent = 'Edit Question';
    document.getElementById('modal-submit-btn').textContent = 'Update Question';
    document.getElementById('q-id').value = q.id;
    document.getElementById('q-title').value = q.questionTitle;
    document.getElementById('q-opt1').value = q.option1;
    document.getElementById('q-opt2').value = q.option2;
    document.getElementById('q-opt3').value = q.option3;
    document.getElementById('q-opt4').value = q.option4;
    document.getElementById('q-answer').value = q.rightAnswer;
    document.getElementById('q-category').value = q.category;
    document.getElementById('q-difficulty').value = q.difficultyLevel;
    document.getElementById('question-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('question-modal').classList.add('hidden');
}

async function saveQuestion(e) {
    e.preventDefault();
    const id = document.getElementById('q-id').value;
    const question = {
        questionTitle: document.getElementById('q-title').value,
        option1: document.getElementById('q-opt1').value,
        option2: document.getElementById('q-opt2').value,
        option3: document.getElementById('q-opt3').value,
        option4: document.getElementById('q-opt4').value,
        rightAnswer: document.getElementById('q-answer').value,
        category: document.getElementById('q-category').value,
        difficultyLevel: document.getElementById('q-difficulty').value
    };

    try {
        let res;
        if (id) {
            question.id = parseInt(id);
            res = await fetch(`${API}/api/questions/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(question)
            });
        } else {
            res = await fetch(`${API}/api/questions/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(question)
            });
        }

        if (res.ok) {
            showToast(id ? 'Question updated!' : 'Question added!', 'success');
            closeModal();
            loadQuestions();
        } else {
            const errText = await res.text().catch(() => '');
            showToast(errText || `Failed to save question (${res.status})`, 'error');
        }
    } catch (e) {
        showToast('Error: Could not connect to server', 'error');
    }
}

async function deleteQuestion(id) {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
        const res = await fetch(`${API}/api/questions/delete/${id}`, { method: 'DELETE' });
        if (res.ok) {
            showToast('Question deleted!', 'success');
            loadQuestions();
        } else {
            showToast('Failed to delete question', 'error');
        }
    } catch (e) {
        showToast('Error: Could not connect to server', 'error');
    }
}

// ===== Create Quiz =====
async function loadCategoriesForQuiz() {
    try {
        const res = await fetch(`${API}/api/questions/allQuestions`);
        if (!res.ok) return;
        const questions = await res.json();
        const categories = [...new Set(questions.map(q => q.category))];
        const select = document.getElementById('quiz-category');
        select.innerHTML = '<option value="">Select a category</option>' +
            categories.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
    } catch (e) {
        console.error('Failed to load categories:', e);
    }
}

async function createQuiz(e) {
    e.preventDefault();
    const title = document.getElementById('quiz-title').value;
    const category = document.getElementById('quiz-category').value;
    const numQ = document.getElementById('quiz-num').value;

    try {
        const params = new URLSearchParams({ category, numQ, title });
        const res = await fetch(`${API}/quiz/create?${params.toString()}`, { method: 'POST' });

        if (res.ok) {
            const msg = await res.text();
            showToast(msg, 'success');
            document.getElementById('create-quiz-form').reset();
        } else {
            showToast('Failed to create quiz', 'error');
        }
    } catch (e) {
        showToast('Error: Could not connect to server', 'error');
    }
}

// ===== Take Quiz =====
async function loadQuiz(e) {
    e.preventDefault();
    const id = document.getElementById('quiz-id-input').value;
    currentQuizId = parseInt(id);

    try {
        const res = await fetch(`${API}/quiz/getquiz/${currentQuizId}`);
        if (!res.ok) {
            showToast('Quiz not found', 'error');
            return;
        }
        quizQuestions = await res.json();

        if (quizQuestions.length === 0) {
            showToast('This quiz has no questions', 'error');
            return;
        }

        renderQuizQuestions();
        document.getElementById('quiz-start').classList.add('hidden');
        document.getElementById('quiz-play').classList.remove('hidden');
        document.getElementById('quiz-result').classList.add('hidden');
        document.getElementById('quiz-progress').textContent = `${quizQuestions.length} Questions`;
        document.getElementById('quiz-title-display').textContent = 'Quiz #' + currentQuizId;
    } catch (e) {
        showToast('Error: Could not connect to server', 'error');
    }
}

function renderQuizQuestions() {
    const container = document.getElementById('quiz-questions-container');
    container.innerHTML = quizQuestions.map((q, i) => `
        <div class="quiz-question-card">
            <div class="q-number">Question ${i + 1}</div>
            <div class="q-text">${escapeHtml(q.questionTitle)}</div>
            <div class="options-list">
                ${[q.option1, q.option2, q.option3, q.option4].map((opt, j) => `
                    <label class="option-label">
                        <input type="radio" name="q-${q.id}" value="${escapeAttr(opt)}">
                        <span>${escapeHtml(opt)}</span>
                    </label>
                `).join('')}
            </div>
        </div>
    `).join('');
}

async function submitQuiz() {
    const responses = quizQuestions.map(q => {
        const selected = document.querySelector(`input[name="q-${q.id}"]:checked`);
        return {
            id: q.id,
            response: selected ? selected.value : ''
        };
    });

    const unanswered = responses.filter(r => r.response === '').length;
    if (unanswered > 0) {
        if (!confirm(`You have ${unanswered} unanswered question(s). Submit anyway?`)) return;
    }

    try {
        const res = await fetch(`${API}/quiz/submit/${currentQuizId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(responses)
        });

        if (res.ok) {
            const score = await res.json();
            showResult(score, quizQuestions.length);
        } else {
            showToast('Failed to submit quiz', 'error');
        }
    } catch (e) {
        showToast('Error: Could not connect to server', 'error');
    }
}

function showResult(score, total) {
    document.getElementById('quiz-play').classList.add('hidden');
    document.getElementById('quiz-result').classList.remove('hidden');

    const scoreText = document.getElementById('score-text');
    const scoreCircle = document.getElementById('score-circle');
    const message = document.getElementById('result-message');

    scoreText.textContent = `${score}/${total}`;

    const pct = (score / total) * 100;
    scoreCircle.className = 'score-circle';
    if (pct >= 60) {
        scoreCircle.classList.add('good');
        message.textContent = 'Great job! You did well!';
    } else {
        scoreCircle.classList.add('bad');
        message.textContent = 'Keep practicing, you can do better!';
    }
}

function resetQuiz() {
    currentQuizId = null;
    quizQuestions = [];
    document.getElementById('quiz-start').classList.remove('hidden');
    document.getElementById('quiz-play').classList.add('hidden');
    document.getElementById('quiz-result').classList.add('hidden');
    document.getElementById('quiz-id-input').value = '';
}

// ===== Toast =====
function showToast(message, type) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// ===== Utility =====
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function escapeAttr(text) {
    if (!text) return '';
    return text.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
               .replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
