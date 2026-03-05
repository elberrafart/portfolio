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

// Scroll reveal animation - sections fade/slide in when they enter viewport
function initScrollReveal() {
  const sections = document.querySelectorAll('.scroll-reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  sections.forEach((section, i) => {
    if (i === 0) section.classList.add('revealed');
    else observer.observe(section);
  });
}
initScrollReveal();
