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

  // ── Pre-compute scroll targets BEFORE applying sticky ─────────────
  // We walk the offsetParent chain while the elements are still in normal
  // flow, giving us their true document-absolute positions. These are stored
  // as data attributes and used for nav clicks regardless of scroll state.
  function getDocumentTop(el) {
    let top = 0, node = el;
    while (node) { top += node.offsetTop; node = node.offsetParent; }
    return top;
  }

  sections.forEach(s => {
    s.dataset.navTarget = Math.max(0, getDocumentTop(s) - STICKY_TOP);
  });

  // ── Wire up nav and logo clicks ───────────────────────────────────
  function scrollToId(id) {
    if (!id) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const el = document.getElementById(id);
    if (!el || el.dataset.navTarget === undefined) return;
    window.scrollTo({ top: parseFloat(el.dataset.navTarget), behavior: 'smooth' });
  }

  document.querySelectorAll('.navItems, .logo a').forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href') || '';
      if (!href.startsWith('#')) return;
      e.preventDefault();
      scrollToId(href.slice(1));
    });
  });

  // ── Apply sticky positioning ──────────────────────────────────────
  sections.forEach((s, i) => {
    s.style.position = 'sticky';
    s.style.top      = `${STICKY_TOP}px`;
    s.style.zIndex   = 10 + i;
  });

  // ── Scroll animation ──────────────────────────────────────────────
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
        // Top card: fully in place
        s.style.transform = 'translateX(0) scale(1)';
        s.style.filter    = 'brightness(1)';
        s.style.boxShadow = '';
      } else {
        // Incoming: slide from right with growing shadow
        const dist     = Math.max(0, rect.top - STICKY_TOP);
        const progress = Math.max(0, Math.min(1, 1 - dist / (window.innerHeight * 0.65)));
        const tx       = (1 - progress) * 55; // 55% keeps card mostly within viewport
        s.style.transform = `translateX(${tx.toFixed(1)}%)`;
        s.style.filter    = 'brightness(1)';
        if (progress > 0) {
          const blur  = 20 + progress * 70;
          const alpha = 0.04 + progress * 0.30;
          s.style.boxShadow = `-12px 0 ${blur.toFixed(0)}px rgba(15,15,15,${alpha.toFixed(2)})`;
        } else {
          s.style.boxShadow = '';
        }
      }
    });

    // Progress bar
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
