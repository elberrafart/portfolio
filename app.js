// Portfolio - Shared JS
const lightBtn = document.getElementById('light-btn');

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  if (lightBtn) {
    lightBtn.textContent = document.body.classList.contains('dark-mode') ? '🌙' : '☀';
  }
}

if (lightBtn) {
  lightBtn.addEventListener('click', toggleTheme);
}

function toggleMenu() {
  const menu = document.getElementById('navMenu');
  if (menu) menu.classList.toggle('active');
}

// Close menu when clicking a nav link (mobile)
document.querySelectorAll('.navItems').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navMenu')?.classList.remove('active');
  });
});
