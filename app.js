// ── Dark mode ──────────────────────────────────────────────────────────
const lightBtn = document.getElementById('light-btn');

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  if (lightBtn) {
    lightBtn.textContent = document.body.classList.contains('dark-mode') ? '🌙' : '☀';
  }
}

if (lightBtn) lightBtn.addEventListener('click', toggleTheme);

// ── Mobile nav ─────────────────────────────────────────────────────────
function toggleMenu() {
  document.getElementById('navMenu')?.classList.toggle('active');
}

document.querySelectorAll('.navItems').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navMenu')?.classList.remove('active');
  });
});

// ── Nav link smooth scroll (fixes sticky-section anchor issues) ────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    // Use offsetTop so we scroll to the section's natural document-flow position
    window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
  });
});

// ── Card stacking scroll effect ────────────────────────────────────────
(function () {
  const sections = Array.from(document.querySelectorAll('.page-section'));
  if (!sections.length) return;

  const HEADER_H = 62;   // sticky header height in px
  const PEEK     = 14;   // px each buried card peeks above the one on top
  const SCALE_D  = 0.03; // scale reduction per depth level
  const DIM_D    = 0.07; // brightness reduction per depth level

  // Assign staggered sticky positions
  sections.forEach((s, i) => {
    s.style.position = 'sticky';
    s.style.top      = `${HEADER_H + i * PEEK}px`;
    s.style.zIndex   = 10 + i;
  });

  function getActiveIndex() {
    let active = 0;
    sections.forEach((s, i) => {
      const stickyTop = HEADER_H + i * PEEK;
      if (s.getBoundingClientRect().top <= stickyTop + 2) active = i;
    });
    return active;
  }

  function updateStack() {
    const active = getActiveIndex();

    sections.forEach((s, i) => {
      const depth     = active - i;
      const stickyTop = HEADER_H + i * PEEK;
      const rect      = s.getBoundingClientRect();

      if (depth > 0) {
        // ── Buried card: scale down + dim ──────────────────────────
        const scale = 1 - depth * SCALE_D;
        const ty    = -(depth * PEEK * 0.4);
        s.style.transform = `scale(${scale}) translateY(${ty}px)`;
        s.style.filter    = `brightness(${Math.max(0.68, 1 - depth * DIM_D)})`;
        s.style.boxShadow = ''; // let CSS handle buried cards
      } else {
        // ── Active / upcoming card ──────────────────────────────────
        s.style.transform = 'scale(1) translateY(0)';
        s.style.filter    = 'brightness(1)';

        // Dynamic shadow: grows as this card approaches sticking over the one below.
        // This makes it look like the card is lifting off and hovering above the stack.
        if (i > 0) {
          const distFromStuck = Math.max(0, rect.top - stickyTop);
          // 0 = far away, 1 = fully stuck on top of previous card
          const progress = Math.max(0, Math.min(1, 1 - distFromStuck / (window.innerHeight * 0.55)));

          if (progress > 0) {
            const shadowY    = 8  + progress * 44;   // shadow moves further down
            const shadowBlur = 20 + progress * 70;   // shadow spreads wider
            const alpha      = 0.06 + progress * 0.30; // shadow darkens
            s.style.boxShadow = [
              `0 ${shadowY}px ${shadowBlur}px rgba(15,15,15,${alpha.toFixed(2)})`,
              `0 2px 8px rgba(15,15,15,0.05)`
            ].join(', ');
          } else {
            s.style.boxShadow = ''; // use CSS default
          }
        }
      }
    });

    // Scroll progress bar
    const prog = document.getElementById('scroll-progress');
    if (prog) {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct  = docH > 0 ? (window.scrollY / docH) * 100 : 0;
      prog.style.width = `${Math.min(100, pct)}%`;
    }

    // Active nav highlight
    const navLinks = document.querySelectorAll('.navItems');
    const ids = sections.map(s => s.id);
    navLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      const isActive = ids[active] && href.includes(ids[active]);
      link.classList.toggle('nav-active', Boolean(isActive));
    });
  }

  window.addEventListener('scroll', updateStack, { passive: true });
  updateStack();
})();

// ── Resume PDF navigation ──────────────────────────────────────────────
(function () {
  const pdfBase    = 'resume/ElberRafartResumeTech.pdf';
  const frame      = document.getElementById('resume-pdf-frame');
  const prevBtn    = document.getElementById('resume-prev');
  const nextBtn    = document.getElementById('resume-next');
  const pageNumEl  = document.getElementById('resume-current-page');
  let currentPage  = 1;
  const totalPages = 2;

  function goToPage(page) {
    currentPage = Math.max(1, Math.min(totalPages, page));
    if (frame)     frame.src             = pdfBase + '#page=' + currentPage;
    if (pageNumEl) pageNumEl.textContent = currentPage;
    if (prevBtn)   prevBtn.disabled      = currentPage <= 1;
    if (nextBtn)   nextBtn.disabled      = currentPage >= totalPages;
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToPage(currentPage + 1));
  goToPage(1);
})();
