const availableIcons = ['🚀', '🦁', '⚡', '🔥', '👑', '🎯'];
const sampleQuestions = [
  "1-savol: O'zbekistonning poytaxti qaysi shahar?",
  "2-savol: Dunyodagi eng katta okean qaysi?",
  "3-savol: Ingliz tilida 'Apple' so'zining ma'nosi nima?",
  "4-savol: Quyosh tizimidagi eng katta planeta qaysi?",
  "5-savol: 12 * 12 nechiga teng?"
];

let teams = [];
let currentTeamIndex = 0;
let currentQuestionIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  const selectors = document.querySelectorAll('.icon-selector');

  selectors.forEach((selector) => {
    availableIcons.forEach((icon, index) => {
      const iconSpan = document.createElement('span');
      iconSpan.classList.add('icon-item');
      if (index === 0) iconSpan.classList.add('active');
      iconSpan.textContent = icon;

      iconSpan.addEventListener('click', () => {
        selector.querySelectorAll('.icon-item').forEach(el => el.classList.remove('active'));
        iconSpan.classList.add('active');
      });

      selector.appendChild(iconSpan);
    });
  });

  document.getElementById('start-btn').addEventListener('click', startGame);
  document.getElementById('correct-btn').addEventListener('click', () => handleAnswer(true));
  document.getElementById('wrong-btn').addEventListener('click', () => handleAnswer(false));
});

function startGame() {
  teams = [];
  const cards = document.querySelectorAll('.team-card');

  cards.forEach((card, i) => {
    const nameInput = card.querySelector('.team-name');
    const activeIcon = card.querySelector('.icon-item.active');

    teams.push({
      name: nameInput.value || `${i + 1}-Jamoa`,
      icon: activeIcon ? activeIcon.textContent : '🚀',
      score: 0
    });
  });

  document.getElementById('setup-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');

  updateGameView();
}

function updateGameView() {
  const scoreboard = document.getElementById('scoreboard');
  scoreboard.innerHTML = '';

  teams.forEach((team, index) => {
    const card = document.createElement('div');
    card.className = `score-card ${index === currentTeamIndex ? 'active-turn' : ''}`;
    card.innerHTML = `
      <div style="font-size: 1.5rem;">${team.icon}</div>
      <strong>${team.name}</strong>
      <div style="font-size: 1.2rem; color: #10b981;">${team.score} ball</div>
    `;
    scoreboard.appendChild(card);
  });

  document.getElementById('current-turn').textContent = `Navbat: ${teams[currentTeamIndex].icon} ${teams[currentTeamIndex].name}`;
  document.getElementById('question-text').textContent = sampleQuestions[currentQuestionIndex % sampleQuestions.length];
}

function handleAnswer(isCorrect) {
  if (isCorrect) {
    teams[currentTeamIndex].score += 10;
  }

  currentTeamIndex = (currentTeamIndex + 1) % teams.length;
  currentQuestionIndex++;

  updateGameView();
}
