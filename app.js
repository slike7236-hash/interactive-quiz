// --- 1. O'YIN SAVOLLARI VA MANTIQI ---
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
      { points: 200, question: "Ingliz tilida nechta harf bor?", answer: "26 ta" },
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
  initAquarium(); // Nom to'g'rilandi (init3DAquarium emas)

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
      // "active" klassi o'rniga CSS ga mos holda ham active beramiz
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
    
    // Xavfsiz tanlov: agar active topilmasa standart ikonka beriladi
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

// Akvarium va Jonli Baliqlar Dvigateli
function initAquarium() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const fishIcons = ['🐠', '🐟', '🐡', '🦈', '🐙'];
  const fishes = Array.from({ length: 15 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 25 + 30,
    speed: Math.random() * 1.5 + 0.8,
    dir: Math.random() < 0.5 ? 1 : -1,
    icon: fishIcons[Math.floor(Math.random() * fishIcons.length)]
  }));

  const bubbles = Array.from({ length: 40 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 4 + 2,
    speed: Math.random() * 1 + 0.5
  }));

  function draw() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0284c7');
    gradient.addColorStop(0.5, '#0369a1');
    gradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    bubbles.forEach(b => {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
      b.y -= b.speed;
      if (b.y < 0) {
        b.y = canvas.height;
        b.x = Math.random() * canvas.width;
      }
    });

    fishes.forEach(f => {
      ctx.font = `${f.size}px Arial`;
      ctx.save();
      ctx.translate(f.x, f.y);
      if (f.dir === -1) ctx.scale(-1, 1);
      ctx.fillText(f.icon, 0, 0);
      ctx.restore();

      f.x += f.speed * f.dir;
      if (f.x > canvas.width + 50) f.dir = -1;
      if (f.x < -50) f.dir = 1;
    });

    requestAnimationFrame(draw);
  }

  draw();
}
