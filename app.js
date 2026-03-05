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

// Scroll reveal animation - sections slide up + fade in when they enter viewport
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
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );
  sections.forEach((section, i) => {
    if (i === 0) section.classList.add('revealed');
    else observer.observe(section);
  });
}
initScrollReveal();

// Resume PDF page navigation (page 1 / page 2)
(function () {
  const pdfBase = 'resume/ElberRafartResumeTech.pdf';
  const frame = document.getElementById('resume-pdf-frame');
  const prevBtn = document.getElementById('resume-prev');
  const nextBtn = document.getElementById('resume-next');
  const pageNumEl = document.getElementById('resume-current-page');
  let currentPage = 1;
  const totalPages = 2;

  function goToPage(page) {
    currentPage = Math.max(1, Math.min(totalPages, page));
    if (frame) frame.src = pdfBase + '#page=' + currentPage;
    if (pageNumEl) pageNumEl.textContent = currentPage;
    if (prevBtn) prevBtn.disabled = currentPage <= 1;
    if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToPage(currentPage + 1));
  goToPage(1);
})();
