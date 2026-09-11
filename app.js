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
  init3DAquarium(); // 3D Akvariumni ishga tushirish

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


// --- 2. THREE.JS 3D AKVARIUM DVIGATELI ---
function init3DAquarium() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || !window.THREE) return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0284c7, 0.015);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Yorug'lik
  const ambientLight = new THREE.AmbientLight(0x0284c7, 1.5);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 2);
  dirLight.position.set(0, 50, 10);
  scene.add(dirLight);

  // 3D Baliqlar Yaratish (Geometrik Baliq Modeli)
  function createFish() {
    const fishGroup = new THREE.Group();

    // Tana (Cone)
    const bodyGeo = new THREE.ConeGeometry(1, 3, 8);
    bodyGeo.rotateZ(-Math.PI / 2);
    const bodyMat = new THREE.MeshPhongMaterial({ color: Math.random() > 0.5 ? 0xff7700 : 0x00ffcc, flatShading: true });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    fishGroup.add(body);

    // Dumi (Tail)
    const tailGeo = new THREE.ConeGeometry(0.8, 1.5, 3);
    tailGeo.rotateZ(Math.PI / 2);
    const tailMat = new THREE.MeshPhongMaterial({ color: 0xff3366 });
    const tail = new THREE.Mesh(tailGeo, tailMat);
    tail.position.x = -1.8;
    fishGroup.add(tail);

    return fishGroup;
  }

  const fishes = [];
  for (let i = 0; i < 15; i++) {
    const fish = createFish();
    fish.position.set(
      (Math.random() - 0.5) * 60,
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 30
    );
    const speed = Math.random() * 0.1 + 0.05;
    const scale = Math.random() * 0.8 + 0.6;
    fish.scale.set(scale, scale, scale);

    scene.add(fish);
    fishes.push({ mesh: fish, speed: speed, direction: 1 });
  }

  // 3D Pufakchalar (Sphere)
  const bubbleGeo = new THREE.SphereGeometry(0.3, 8, 8);
  const bubbleMat = new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });
  const bubbles = [];

  for (let i = 0; i < 50; i++) {
    const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
    bubble.position.set(
      (Math.random() - 0.5) * 80,
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 40
    );
    scene.add(bubble);
    bubbles.push({ mesh: bubble, speed: Math.random() * 0.08 + 0.02 });
  }

  // Animatsiya sikli
  function animate() {
    requestAnimationFrame(animate);

    // Baliqlar suzishi
    fishes.forEach(f => {
      f.mesh.position.x += f.speed * f.direction;
      f.mesh.rotation.z = Math.sin(Date.now() * 0.005) * 0.1;

      if (f.mesh.position.x > 35) {
        f.direction = -1;
        f.mesh.rotation.y = Math.PI;
      } else if (f.mesh.position.x < -35) {
        f.direction = 1;
        f.mesh.rotation.y = 0;
      }
    });

    // Pufakchalar ko'tarilishi
    bubbles.forEach(b => {
      b.mesh.position.y += b.speed;
      if (b.mesh.position.y > 25) {
        b.mesh.position.y = -25;
        b.mesh.position.x = (Math.random() - 0.5) * 80;
      }
    });

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
