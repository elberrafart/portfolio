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

// ── Nav smooth scroll ──────────────────────────────────────────────────
// offsetTop alone doesn't work reliably with sticky parents, so we
// walk the offsetParent chain to get the true document-relative position.
function getDocumentTop(el) {
  let top = 0;
  let node = el;
  while (node) {
    top += node.offsetTop;
    node = node.offsetParent;
  }
  return top;
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);
    if (!id) return; // bare "#" (logo)
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const HEADER_H = 62;
    window.scrollTo({ top: Math.max(0, getDocumentTop(target) - HEADER_H), behavior: 'smooth' });
  });
});

// ── Card stacking — slides in from the right ───────────────────────────
(function () {
  const sections = Array.from(document.querySelectorAll('.page-section'));
  if (!sections.length) return;

  const STICKY_TOP = 70;   // px from top of viewport where all cards stick
  const SCALE_D    = 0.025;// scale shrink per depth level for buried cards
  const DIM_D      = 0.08; // brightness drop per depth level
  const PUSH_D     = 6;    // % cards shift left per depth level

  // All cards share the same sticky top — stacking is horizontal, not vertical
  sections.forEach((s, i) => {
    s.style.position = 'sticky';
    s.style.top      = `${STICKY_TOP}px`;
    s.style.zIndex   = 10 + i;
  });

  function getActiveIndex() {
    // The last section whose card has reached (or passed) the sticky position
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
        // ── Buried card: shift left + scale down + dim ──────────────
        const tx    = -(depth * PUSH_D);
        const scale = Math.max(0.88, 1 - depth * SCALE_D);
        const bri   = Math.max(0.60, 1 - depth * DIM_D);
        s.style.transform = `translateX(${tx}%) scale(${scale})`;
        s.style.filter    = `brightness(${bri})`;
        s.style.boxShadow = '';

      } else if (i === active) {
        // ── Current top card: fully in place ────────────────────────
        s.style.transform = 'translateX(0) scale(1)';
        s.style.filter    = 'brightness(1)';
        s.style.boxShadow = '';

      } else {
        // ── Incoming card: slide in from the right ──────────────────
        // progress 0 = card is far below, 1 = card has reached sticky top
        const dist     = Math.max(0, rect.top - STICKY_TOP);
        const progress = Math.max(0, Math.min(1, 1 - dist / (window.innerHeight * 0.65)));
        const tx       = (1 - progress) * 72; // start 72% off to the right

        s.style.transform = `translateX(${tx.toFixed(1)}%)`;
        s.style.filter    = 'brightness(1)';

        // Left-edge shadow grows as the card approaches, simulating it
        // hovering above and casting a shadow onto the card beneath it
        if (progress > 0) {
          const blur  = 20 + progress * 70;
          const alpha = 0.04 + progress * 0.30;
          s.style.boxShadow = `-12px 0 ${blur.toFixed(0)}px rgba(15,15,15,${alpha.toFixed(2)})`;
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
