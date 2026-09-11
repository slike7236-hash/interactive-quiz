// 20 Available Icons for Setup
const AVAILABLE_ICONS = ['🦁', '🦊', '🦅', '🐻', '🦉', '🚀', '🐱', '🐶', '🐯', '🐼', '🐸', '⚽', '🎨', '🎵', '🔬', '💡', '👑', '🔥', '⭐', '🛡️'];

// 21 Question Cards Data (Tarot Style Icons)
const QUESTIONS = [
    { id: 1, icon: '🦁', title: 'Maktab', answer: 'Maktab', points: 10, variants: ['Maktab', 'Ruchka', 'Kitob', 'O'qituvchi'] },
    { id: 2, icon: '🦉', title: 'Kitob', answer: 'Kitob', points: 10, variants: ['Daftar', 'Kitob', 'Qalam', 'Sinf'] },
    { id: 3, icon: '🚀', title: 'Koinot', answer: 'Koinot', points: 10, variants: ['Quyosh', 'Koinot', 'Yulduz', 'Ota'] },
    { id: 4, icon: '🎵', title: 'Musiqa', answer: 'Musiqa', points: 10, variants: ['Musiqa', 'Qo'shiq', 'Raqs', 'Teatr'] },
    { id: 5, icon: '🔬', title: 'Fan', answer: 'Fan', points: 10, variants: ['Tarix', 'Matematika', 'Fan', 'Kimyo'] },
    { id: 6, icon: '🎨', title: 'San'at', answer: 'Sanat', points: 10, variants: ['Rasm', 'Sanat', 'Haykal', 'Rang'] },
    { id: 7, icon: '✏️', title: 'Qalam', answer: 'Qalam', points: 10, variants: ['Ruchka', 'Sizg'ich', 'Qalam', 'O'chirg'ich'] },
    { id: 8, icon: '🦊', title: 'Tulki', answer: 'Tulki', points: 10, variants: ['Bori', 'Tulki', 'Ayiq', 'Quyon'] },
    { id: 9, icon: '🐻', title: 'Ayiq', answer: 'Ayiq', points: 10, variants: ['Ayiq', 'Bori', 'Sher', 'Panda'] },
    { id: 10, icon: '🐧', title: 'Pingvin', answer: 'Pingvin', points: 10, variants: ['Oqqush', 'Pingvin', 'O'rdak', 'Burgut'] },
    { id: 11, icon: '🐱', title: 'Mushuk', answer: 'Mushuk', points: 10, variants: ['Kuchuk', 'Mushuk', 'Sichqon', 'Quyon'] },
    { id: 12, icon: '🦅', title: 'Burgut', answer: 'Burgut', points: 10, variants: ['Lochin', 'Burgut', 'Qarg'a', 'Kaptar'] },
    { id: 13, icon: '🦁', title: 'Sher', answer: 'Sher', points: 10, variants: ['Yo'lbars', 'Sher', 'Qoplon', 'Pardus'] },
    { id: 14, icon: '😊', title: 'Tassavur', answer: 'Kulgu', points: 10, variants: ['Quvonch', 'Kulgu', 'Maza', 'Xursand'] },
    { id: 15, icon: '🌍', title: 'Yer', answer: 'Yer', points: 10, variants: ['Oylik', 'Yer', 'Quyosh', 'Mars'] },
    { id: 16, icon: '🎨', title: 'Palitra', answer: 'Rasm', points: 10, variants: ['Rasm', 'Boyoqlik', 'Sanoat', 'Rang'] },
    { id: 17, icon: '📝', title: 'Daftar', answer: 'Daftar', points: 10, variants: ['Kitob', 'Daftar', 'Varaq', 'Hujjat'] },
    { id: 18, icon: '🦇', title: 'Ko'shapalak', answer: 'Tungi', points: 10, variants: ['Qush', 'Tungi', 'Sichqon', 'Uchar'] },
    { id: 19, icon: '☀️', title: 'Quyosh', answer: 'Quyosh', points: 10, variants: ['Yulduz', 'Quyosh', 'Olov', 'Nurlik'] },
    { id: 20, icon: '⚽', title: 'To'p', answer: 'Top', points: 10, variants: ['Maydon', 'Top', 'O'yin', 'Darvoza'] },
    { id: 21, icon: '🔮', title: 'Sehr', answer: 'Sehr', points: 10, variants: ['Sehr', 'Mantiq', 'Omad', 'Sir'] }
];

// App State
let teams = [
    { name: 'Leon', icon: '🦁', score: 0 },
    { name: 'Fox', icon: '🦊', score: 0 },
    { name: 'Eagle', icon: '🦅', score: 0 }
];

let currentTurnTeamIndex = 0;
let currentQuestion = null;
let currentQuestionCardIndex = null;
let answeredQuestions = new Set();

// Active Help Modifiers for Current Question
let isVariantActive = false;
let isLetterActive = false;
let revealedLettersCount = 0;
let revealedLetterIndices = new Set();
let is2080Active = false;
let selected2080TeamIndex = null;
let selectedVariantText = null;

// DOM Elements
const setupScreen = document.getElementById('setup-screen');
const boardScreen = document.getElementById('board-screen');
const questionScreen = document.getElementById('question-screen');
const scoreboard = document.getElementById('persistent-scoreboard');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initIconSelectors();
    document.getElementById('start-game-btn').addEventListener('click', startGame);
    document.getElementById('btn-help-variant').addEventListener('click', activateVariantHelp);
    document.getElementById('btn-help-letter').addEventListener('click', activateLetterHelp);
    document.getElementById('btn-help-2080').addEventListener('click', activate2080Help);
    document.getElementById('btn-check-answer').addEventListener('click', checkAnswer);
    document.getElementById('btn-back-to-board').addEventListener('click', backToBoard);
});

function initIconSelectors() {
    teams.forEach((team, teamIndex) => {
        const container = document.getElementById(`icons-team-${teamIndex}`);
        container.innerHTML = '';
        AVAILABLE_ICONS.forEach((icon) => {
            const div = document.createElement('div');
            div.className = `icon-option ${icon === team.icon ? 'selected' : ''}`;
            div.textContent = icon;
            div.addEventListener('click', () => {
                container.querySelectorAll('.icon-option').forEach(el => el.classList.remove('selected'));
                div.classList.add('selected');
                teams[teamIndex].icon = icon;
            });
            container.appendChild(div);
        });
    });
}

function startGame() {
    // Read Team Names
    document.querySelectorAll('.team-card-setup').forEach((card, idx) => {
        const nameInput = card.querySelector('.team-name-input');
        if (nameInput.value.trim() !== '') {
            teams[idx].name = nameInput.value.trim();
        }
    });

    updateScoreboard();
    setupScreen.classList.remove('active');
    boardScreen.classList.add('active');
    scoreboard.classList.remove('hidden');

    renderCardsBoard();
}

function updateScoreboard() {
    teams.forEach((t, i) => {
        const card = document.getElementById(`score-card-${i}`);
        card.querySelector('.team-score-icon').textContent = t.icon;
        card.querySelector('.team-score-name').textContent = t.name;
        card.querySelector('.team-score-pts').textContent = `${t.score} pts`;

        if (i === currentTurnTeamIndex) {
            card.classList.add('active-turn');
        } else {
            card.classList.remove('active-turn');
        }
    });

    document.getElementById('current-turn-name').textContent = teams[currentTurnTeamIndex].name;
}

function renderCardsBoard() {
    const grid = document.getElementById('cards-grid');
    grid.innerHTML = '';

    QUESTIONS.forEach((q, idx) => {
        const card = document.createElement('div');
        card.className = `tarot-card ${answeredQuestions.has(idx) ? 'disabled' : ''}`;
        card.innerHTML = `
            <span class="card-icon">${q.icon}</span>
            <span class="card-num">${q.id}</span>
        `;

        if (!answeredQuestions.has(idx)) {
            card.addEventListener('click', () => openQuestion(idx));
        }
        grid.appendChild(card);
    });
}

function openQuestion(index) {
    currentQuestionCardIndex = index;
    currentQuestion = QUESTIONS[index];

    // Reset Help States
    isVariantActive = false;
    isLetterActive = false;
    revealedLettersCount = 0;
    revealedLetterIndices.clear();
    is2080Active = false;
    selected2080TeamIndex = null;
    selectedVariantText = null;

    // Reset Inputs and UI Area
    document.getElementById('type-answer-input').value = '';
    document.getElementById('variants-box').classList.add('hidden');
    document.getElementById('letters-box').classList.add('hidden');
    document.getElementById('team-split-box').classList.add('hidden');

    // Display
    document.getElementById('question-text').textContent = currentQuestion.title;
    document.getElementById('question-points').textContent = `${currentQuestion.points} pts`;

    boardScreen.classList.remove('active');
    questionScreen.classList.add('active');
}

/* HELP 1: Variant (25%) */
function activateVariantHelp() {
    if (isVariantActive) return;
    isVariantActive = true;

    const variantsBox = document.getElementById('variants-box');
    variantsBox.className = 'variants-grid';
    variantsBox.innerHTML = '';

    currentQuestion.variants.forEach(v => {
        const item = document.createElement('div');
        item.className = 'variant-item';
        item.textContent = v;
        item.addEventListener('click', () => {
            variantsBox.querySelectorAll('.variant-item').forEach(el => el.classList.remove('selected'));
            item.classList.add('selected');
            selectedVariantText = v;
            document.getElementById('type-answer-input').value = v;
        });
        variantsBox.appendChild(item);
    });
}

/* HELP 2: Letter (-20% entry, up to 2 letters revealable at -20% each) */
function activateLetterHelp() {
    isLetterActive = true;
    const lettersBox = document.getElementById('letters-box');
    lettersBox.className = 'letters-container';
    lettersBox.innerHTML = '';

    const answerStr = currentQuestion.answer;
    for (let i = 0; i < answerStr.length; i++) {
        const tile = document.createElement('div');
        tile.className = `letter-tile ${revealedLetterIndices.has(i) ? 'revealed' : ''}`;
        tile.textContent = revealedLetterIndices.has(i) ? answerStr[i] : '*';

        tile.addEventListener('click', () => {
            if (!revealedLetterIndices.has(i)) {
                if (revealedLettersCount >= 2) {
                    alert('Harf ochish limiti (2 ta) ga yetdingiz!');
                    return;
                }
                revealedLettersCount++;
                revealedLetterIndices.add(i);
                tile.textContent = answerStr[i];
                tile.classList.add('revealed');
            }
        });

        lettersBox.appendChild(tile);
    }
}

/* HELP 3: 20/80 Split */
function activate2080Help() {
    if (is2080Active) return;
    is2080Active = true;

    const box = document.getElementById('team-split-box');
    box.className = 'team-split-container';
    box.innerHTML = `<p>Qaysi jamoaning javobiga qo'shilasiz? (To'g'ri bo'lsa 20% sizga, 80% javob bergan jamoaga):</p>`;

    const btnsDiv = document.createElement('div');
    btnsDiv.className = 'team-choice-btns';

    teams.forEach((t, idx) => {
        if (idx !== currentTurnTeamIndex) {
            const btn = document.createElement('button');
            btn.className = 'split-choice-btn';
            btn.textContent = `${t.icon} ${t.name}`;
            btn.addEventListener('click', () => {
                btnsDiv.querySelectorAll('.split-choice-btn').forEach(el => el.classList.remove('selected'));
                btn.classList.add('selected');
                selected2080TeamIndex = idx;
            });
            btnsDiv.appendChild(btn);
        }
    });

    box.appendChild(btnsDiv);
}

/* CHECK ANSWER */
function checkAnswer() {
    const userAns = document.getElementById('type-answer-input').value.trim().toLowerCase();
    const correctAns = currentQuestion.answer.toLowerCase();
    const isCorrect = (userAns === correctAns);

    const basePts = currentQuestion.points;

    if (is2080Active) {
        if (selected2080TeamIndex === null) {
            alert('Iltimos, 20/80 uchun jamoani tanlang!');
            return;
        }

        if (isCorrect) {
            // Correct team answer
            teams[currentTurnTeamIndex].score += basePts * 0.20; // 20%
            teams[selected2080TeamIndex].score += basePts * 0.80; // 80%
            alert(`To'g'ri! ${teams[currentTurnTeamIndex].name} 20% (${basePts*0.2}), ${teams[selected2080TeamIndex].name} 80% (${basePts*0.8}) ball oldi!`);
        } else {
            alert(`Noto'g'ri javob! Hech kimga ball berilmadi.`);
        }
    } else {
        if (isCorrect) {
            let percentage = 1.00; // 100% default

            if (isVariantActive) {
                percentage = 0.25; // 25% for variant
            } else if (isLetterActive) {
                // Base letter penalty = 20%
                // Each revealed letter = 20%
                percentage = 0.80 - (revealedLettersCount * 0.20); 
            }

            const pointsEarned = basePts * percentage;
            teams[currentTurnTeamIndex].score += pointsEarned;
            alert(`To'g'ri javob! ${pointsEarned} ball berildi! (${percentage * 100}%)`);
        } else {
            alert(`Xato javob! To'g'ri javob: "${currentQuestion.answer}" edi.`);
        }
    }

    // Mark card as answered & Next Turn
    answeredQuestions.add(currentQuestionCardIndex);
    currentTurnTeamIndex = (currentTurnTeamIndex + 1) % teams.length;

    updateScoreboard();
    backToBoard();
}

function backToBoard() {
    questionScreen.classList.remove('active');
    boardScreen.classList.add('active');
    renderCardsBoard();
}
