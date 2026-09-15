// --- 1. O'YIN SAVOLLARI VA MANTIQI ---
const quizData = [
  {
    category: "Vocabulary",
    questions: [
      { points: 100, question: "'Monsoon' so'zining o'zbekcha tarjimasi nima?", answer: "Musson / Musson yomg'irlari" },
      { points: 100, question: "'Lightning' so'zining ma'nosi nima?", answer: "Yashin / Chaqmoq" },
      { points: 100, question: "Sizda BONUS!", answer: "+100 ball" },
      { points: 100, question: "'Drought' so'zining o'zbekcha tarjimasi nima?", answer: "Qurg'oqchilik" },
      { points: 100, question: "'Thunder' so'zining ma'nosi nima?", answer: "Momaqaldiroq / Guldurash" },
      { points: 100, question: "'Shadow' so'zining ma'nosi nima?", answer: "Soya" },
      { points: 100, question: "'Pen pal' so'zining tarjimasi nima?", answer: "Xat-xabar orqali yozishib turadigan do'st" },
      { points: 100, question: "'Vacation' so'zining o'zbekcha tarjimasi nima?", answer: "Ta'til" },
      { points: 100, question: "'Flood' so'zining ma'nosi nima?", answer: "Toshqin / Suv bosishi" }
    ]
  },
  {
    category: "Translation",
    questions: [
      { points: 200, question: "'Qorli' so'zining inglizcha tarjimasi nima?", answer: "Snowy" },
      { points: 200, question: "'Mintaqaga yoki yerga yetib kelmoq' fe'lining inglizchasi nima?", answer: "Arrive" },
      { points: 200, question: "'Kuz' (yil fasli) ingliz tilida nima deyiladi?", answer: "Fall" },
      { points: 200, question: "'Yomg'ir' so'zining inglizcha tarjimasi nima?", answer: "Rain" },
      { points: 200, question: "'Quruq' so'zining inglizcha tarjimasi nima?", answer: "Dry" },
      { points: 200, question: "'O'zgarmoq / O'zgartirmoq' fe'lining inglizchasi nima?", answer: "Change" },
      { points: 200, question: "Sizda BONUS!", answer: "+200 ball" },
      { points: 200, question: "'Qolmoq' (masalan: mehmonxonada) fe'lining inglizcha tarjimasi nima?", answer: "Stay" },
      { points: 200, question: "'Yoz' faslining inglizcha tarjimasi nima?", answer: "Summer" }
    ]
  },
  {
    category: "Definitions",
    questions: [
      { points: 300, question: "What word means to continue or remaining, or the final one?", answer: "Last" },
      { points: 300, question: "What is the blue space above the Earth where you see clouds and the sun?", answer: "Sky" },
      { points: 300, question: "What season comes after winter, when flowers start to grow?", answer: "Spring" },
      { points: 300, question: "What is the season when it is very cold and often snows?", answer: "Winter" },
      { points: 300, question: "What do you call bad weather with strong winds, heavy rain, and thunder?", answer: "Storm" },
      { points: 300, question: "What is a large, dry area of land with very little water and few plants?", answer: "Desert" },
      { points: 300, question: "Sizda BONUS!", answer: "+400 ball" },
      { points: 300, question: "What word means having a very low temperature or not warm?", answer: "Cold" },
      { points: 300, question: "What word describes weather with a lot of bright light from the sun?", answer: "Sunny" }
    ]
  }
];

const icons = ['🚀', '🦁', '⚡', '🔥', '👑', '🎯'];
let teams = [];
let activeTile = null;
let currentPoints = 0;

document.addEventListener('DOMContentLoaded', () => {
  setupIconSelectors();

  // O'yinni boshlash tugmasi
  const startBtn = document.getElementById('start-game-btn');
  if (startBtn) {
    startBtn.addEventListener('click', startGame);
  }

  // Javobni ko'rsatish
  const showAnsBtn = document.getElementById('show-answer-btn');
  if (showAnsBtn) {
    showAnsBtn.addEventListener('click', () => {
      document.getElementById('modal-answer').classList.remove('hidden');
    });
  }

  // Modalni yopish
  const closeBtn = document.getElementById('close-modal');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
});

function setupIconSelectors() {
  document.querySelectorAll('.icon-selector').forEach(selector => {
    icons.forEach((icon, i) => {
      const span = document.createElement('span');
      span.className = `icon-option ${i === 0 ? 'active selected' : ''}`;
      span.textContent = icon;
      span.addEventListener('click', () => {
        selector.querySelectorAll('.icon-option').forEach(el => el.classList.remove('active', 'selected'));
        span.classList.add('active', 'selected');
      });
      selector.appendChild(span);
    });
  });
}

function startGame() {
  teams = [];
  document.querySelectorAll('.team-setup-card').forEach((card, index) => {
    const nameInput = card.querySelector('.team-name-input');
    const name = nameInput ? nameInput.value || `${index + 1}-Jamoa` : `${index + 1}-Jamoa`;
    
    const activeIconEl = card.querySelector('.icon-option.active') || card.querySelector('.icon-option');
    const icon = activeIconEl ? activeIconEl.textContent : '🚀';

    teams.push({ id: index, name, icon, score: 0 });
  });

  document.getElementById('setup-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');

  renderScoreboard();
  renderQuizBoard();
}

function renderScoreboard() {
  const board = document.getElementById('scoreboard');
  if (!board) return;
  board.innerHTML = '';
  teams.forEach(team => {
    const card = document.createElement('div');
    card.className = 'team-score-card';
    card.innerHTML = `
      <div class="team-icon" style="font-size: 1.5rem;">${team.icon}</div>
      <h4>${team.name}</h4>
      <div class="score">${team.score} pt</div>
    `;
    board.appendChild(card);
  });
}

function renderQuizBoard() {
  const board = document.getElementById('quiz-board');
  if (!board) return;
  board.innerHTML = '';

  quizData.forEach(cat => {
    const col = document.createElement('div');
    col.className = 'category-column';
    col.style.display = 'flex';
    col.style.flexDirection = 'column';
    col.style.gap = '10px';
    
    const header = document.createElement('div');
    header.className = 'category-header';
    header.style.textAlign = 'center';
    header.style.fontWeight = 'bold';
    header.style.color = '#38bdf8';
    header.style.padding = '10px';
    header.textContent = cat.category;
    col.appendChild(header);

    cat.questions.forEach(q => {
      const tile = document.createElement('div');
      tile.className = 'quiz-card';
      tile.textContent = `${q.points} pt`;
      tile.addEventListener('click', () => openQuestion(tile, cat.category, q));
      col.appendChild(tile);
    });

    board.appendChild(col);
  });
}

function openQuestion(tile, category, qData) {
  if (tile.classList.contains('disabled')) return;
  activeTile = tile;
  currentPoints = qData.points;

  document.getElementById('modal-category').textContent = category;
  document.getElementById('modal-question').textContent = qData.question;
  document.getElementById('modal-answer').textContent = `Javob: ${qData.answer}`;
  document.getElementById('modal-answer').classList.add('hidden');

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
    activeTile.classList.add('disabled');
    activeTile.textContent = '✓';
  }
  closeModal();
  renderScoreboard();
}

function closeModal() {
  document.getElementById('question-modal').classList.add('hidden');
}
