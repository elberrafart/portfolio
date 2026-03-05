// ── Dark mode ──────────────────────────────────────────────────────────
const lightBtn = document.getElementById('light-btn');

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  if (lightBtn) {
    lightBtn.textContent = document.body.classList.contains('dark-mode') ? '🌙' : '☀';
  }
}
if (lightBtn) lightBtn.addEventListener('click', toggleTheme);

// ── Mobile nav toggle ──────────────────────────────────────────────────
function toggleMenu() {
  document.getElementById('navMenu')?.classList.toggle('active');
}
document.querySelectorAll('.navItems').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navMenu')?.classList.remove('active');
  });
});

// ── Card stacking — slides in from the right ───────────────────────────
(function () {
  const sections = Array.from(document.querySelectorAll('.page-section'));
  if (!sections.length) return;

  const STICKY_TOP = 70;
  const SCALE_D    = 0.025;
  const DIM_D      = 0.08;
  const PUSH_D     = 6;

  // ── Helper: walk offsetParent chain for true document position ─────
  function docTop(el) {
    let top = 0, node = el;
    while (node) { top += node.offsetTop; node = node.offsetParent; }
    return top;
  }

  // ── Pre-compute nav targets NOW, before sticky is applied ──────────
  // Sticky/transforms at click-time would corrupt live measurements,
  // so we snapshot positions here while the page is in normal flow.
  const navTargets = new Map();
  sections.forEach(s => {
    navTargets.set(s.id, Math.max(0, docTop(s) - STICKY_TOP));
  });

  // ── Nav clicks ─────────────────────────────────────────────────────
  function goTo(id) {
    const top = id ? navTargets.get(id) : 0;
    if (top === undefined) return;
    // 'instant' avoids smooth-scroll being cancelled mid-way by the browser
    window.scrollTo({ top, behavior: 'instant' });
    // Force a stack update immediately so the correct card is shown
    requestAnimationFrame(updateStack);
  }

  document.querySelectorAll('.navItems').forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href') || '';
      if (!href.startsWith('#')) return;
      e.preventDefault();
      goTo(href.slice(1));
    });
  });

  // Logo → back to top
  const logo = document.querySelector('.logo a');
  if (logo) {
    logo.addEventListener('click', e => { e.preventDefault(); goTo(''); });
  }

  // ── Apply sticky ───────────────────────────────────────────────────
  sections.forEach((s, i) => {
    s.style.position = 'sticky';
    s.style.top      = `${STICKY_TOP}px`;
    s.style.zIndex   = 10 + i; // higher index = on top when active
  });

  // ── Scroll animation ───────────────────────────────────────────────
  function getActiveIndex() {
    let active = 0;
    sections.forEach((s, i) => {
      if (s.getBoundingClientRect().top <= STICKY_TOP + 2) active = i;
    });
    return active;
  }

  function updateStack() {
    const active = getActiveIndex();

    sections.forEach((s, i) => {
      const depth = active - i;
      const rect  = s.getBoundingClientRect();

      if (depth > 0) {
        // Buried: shift left, scale down, dim
        const tx    = -(depth * PUSH_D);
        const scale = Math.max(0.88, 1 - depth * SCALE_D);
        const bri   = Math.max(0.60, 1 - depth * DIM_D);
        s.style.transform = `translateX(${tx}%) scale(${scale})`;
        s.style.filter    = `brightness(${bri})`;
        s.style.boxShadow = '';

      } else if (i === active) {
        // Top card: fully in place, no transform
        s.style.transform = 'translateX(0) scale(1)';
        s.style.filter    = 'brightness(1)';
        s.style.boxShadow = '';

      } else {
        // Incoming: fully off-screen right, slides into place.
        // overflow-x: hidden on html/body clips it so it's invisible
        // until it enters the viewport — no z-index overlap issues.
        const dist     = Math.max(0, rect.top - STICKY_TOP);
        const progress = Math.max(0, Math.min(1, 1 - dist / (window.innerHeight * 0.65)));
        const tx       = (1 - progress) * 100; // 100% = fully off right edge

        s.style.transform = `translateX(${tx.toFixed(1)}%)`;
        s.style.filter    = 'brightness(1)';

        // Left-edge shadow grows as the card approaches the stack
        if (progress > 0.05) {
          const blur  = 20 + progress * 80;
          const alpha = 0.04 + progress * 0.28;
          s.style.boxShadow = `-16px 0 ${blur.toFixed(0)}px rgba(15,15,15,${alpha.toFixed(2)})`;
        } else {
          s.style.boxShadow = '';
        }
      }
    });

    // Scroll progress bar
    const prog = document.getElementById('scroll-progress');
    if (prog) {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.width = `${docH > 0 ? Math.min(100, (window.scrollY / docH) * 100) : 0}%`;
    }

    // Active nav highlight
    const ids = sections.map(s => s.id);
    document.querySelectorAll('.navItems').forEach(link => {
      const href = link.getAttribute('href') || '';
      link.classList.toggle('nav-active', Boolean(ids[active] && href.includes(ids[active])));
    });
  }

  window.addEventListener('scroll', updateStack, { passive: true });
  updateStack();
})();
