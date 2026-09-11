// Darslarda ishlatish uchun savollar bazasi (o'zingiz o'zgartirishingiz mumkin)
const quizData = [
  {
    category: "Vocabulary",
    questions: [
      { points: 100, question: "'Environment' so'zining tarjimasi nima?", answer: "Atrof-muhit" },
      { points: 200, question: "'Improve' fe'lining ma'nosi nima?", answer: "Rivojlantirmoq / Yaxshilamoq" },
      { points: 300, question: "'Ancient' so'ziga antonim toping.", answer: "Modern / New" }
    ]
  },
  {
    category: "Grammar",
    questions: [
      { points: 100, question: "'She ___ (go) to school everyday' bo'shliqni to'ldiring.", answer: "goes" },
      { points: 200, question: "'Go' fe'lining 2-shakli (Past Simple) qaysi?", answer: "went" },
      { points: 300, question: "Present Perfect zamonining formulasi qanday?", answer: "Subject + have/has + V3" }
    ]
  },
  {
    category: "General Knowledge",
    questions: [
      { points: 100, question: "Buyuk Britaniyaning poytaxti qaysi shahar?", answer: "London" },
      { points: 200, question: "Aglis tilida nechta harf bor?", answer: "26 ta" },
      { points: 300, question: "Dunyodagi eng kotirovkali til qaysi?", answer: "Ingliz tili" }
    ]
  }
];

const icons = ['🚀', '🦁', '⚡', '🔥', '👑', '🎯'];
let teams = [];
let activeTile = null;
let currentPoints = 0;

document.addEventListener('DOMContentLoaded', () => {
  setupIconSelectors();
  document.getElementById('start-game-btn').addEventListener('click', startGame);
  document.getElementById('show-answer-btn').addEventListener('click', () => {
    document.getElementById('modal-answer').classList.remove('hidden');
  });
  document.getElementById('close-modal').addEventListener('click', closeModal);
});

function setupIconSelectors() {
  document.querySelectorAll('.icon-selector').forEach(selector => {
    icons.forEach((icon, i) => {
      const span = document.createElement('span');
      span.className = `icon-option ${i === 0 ? 'active' : ''}`;
      span.textContent = icon;
      span.addEventListener('click', () => {
        selector.querySelectorAll('.icon-option').forEach(el => el.classList.remove('active'));
        span.classList.add('active');
      });
      selector.appendChild(span);
    });
  });
}

function startGame() {
  teams = [];
  document.querySelectorAll('.team-setup-card').forEach((card, index) => {
    const name = card.querySelector('.team-name-input').value || `${index + 1}-Jamoa`;
    const icon = card.querySelector('.icon-option.active').textContent;
    teams.push({ id: index, name, icon, score: 0 });
  });

  document.getElementById('setup-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');

  renderScoreboard();
  renderQuizBoard();
}

function renderScoreboard() {
  const board = document.getElementById('scoreboard');
  board.innerHTML = '';
  teams.forEach(team => {
    const card = document.createElement('div');
    card.className = 'score-card';
    card.innerHTML = `
      <div class="team-icon">${team.icon}</div>
      <strong>${team.name}</strong>
      <div class="team-score">${team.score} pt</div>
    `;
    board.appendChild(card);
  });
}

function renderQuizBoard() {
  const board = document.getElementById('quiz-board');
  board.innerHTML = '';

  quizData.forEach(cat => {
    const col = document.createElement('div');
    col.className = 'category-column';
    
    const header = document.createElement('div');
    header.className = 'category-header';
    header.textContent = cat.category;
    col.appendChild(header);

    cat.questions.forEach(q => {
      const tile = document.createElement('div');
      tile.className = 'question-tile';
      tile.textContent = `${q.points} pt`;
      tile.addEventListener('click', () => openQuestion(tile, cat.category, q));
      col.appendChild(tile);
    });

    board.appendChild(col);
  });
}

function openQuestion(tile, category, qData) {
  if (tile.classList.contains('used')) return;
  activeTile = tile;
  currentPoints = qData.points;

  document.getElementById('modal-category').textContent = category;
  document.getElementById('modal-question').textContent = qData.question;
  document.getElementById('modal-answer').textContent = `Javob: ${qData.answer}`;
  document.getElementById('modal-answer').classList.add('hidden');

  // Jamoalarga ball berish tugmalarini chiqarish
  const awardList = document.getElementById('team-award-list');
  awardList.innerHTML = '';
  teams.forEach(team => {
    const btn = document.createElement('button');
    btn.className = 'award-btn';
    btn.textContent = `${team.icon} ${team.name}`;
    btn.addEventListener('click', () => awardPoints(team.id));
    awardList.appendChild(btn);
  });

  document.getElementById('question-modal').classList.remove('hidden');
}

function awardPoints(teamId) {
  teams[teamId].score += currentPoints;
  if (activeTile) {
    activeTile.classList.add('used');
    activeTile.textContent = '✓';
  }
  closeModal();
  renderScoreboard();
}

function closeModal() {
  document.getElementById('question-modal').classList.add('hidden');
}
