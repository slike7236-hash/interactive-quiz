const availableIcons = ['🚀', '🦁', '⚡', '🔥', '👑', '🎯'];

document.addEventListener('DOMContentLoaded', () => {
  const selectors = document.querySelectorAll('.icon-selector');

  selectors.forEach((selector) => {
    // Ikonkalarni yaratish
    availableIcons.forEach((icon, index) => {
      const iconSpan = document.createElement('span');
      iconSpan.classList.add('icon-item');
      if (index === 0) iconSpan.classList.add('active'); // Birinchi ikonkani standart tanlangan qilish
      iconSpan.textContent = icon;

      // Ikonkaga bosilganda tanlash
      iconSpan.addEventListener('click', () => {
        selector.querySelectorAll('.icon-item').forEach(el => el.classList.remove('active'));
        iconSpan.classList.add('active');
      });

      selector.appendChild(iconSpan);
    });
  });

  // O'yinni boshlash tugmasi
  const startBtn = document.getElementById('start-btn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      const teamsData = [];
      const cards = document.querySelectorAll('.team-card');

      cards.forEach((card, i) => {
        const nameInput = card.querySelector('.team-name');
        const activeIcon = card.querySelector('.icon-item.active');

        teamsData.push({
          id: i + 1,
          name: nameInput ? nameInput.value : `Jamoa ${i + 1}`,
          icon: activeIcon ? activeIcon.textContent : '🚀'
        });
      });

      console.log("Tanlangan jamoalar:", teamsData);
      alert("O'yin boshlanmoqda! Jamoalar saqlandi.");
    });
  }
});
