document.getElementById('menuBtn')?.addEventListener('click', () => {
  document.getElementById('navList').classList.toggle('open');
});

/* =========================================
   スクロールで要素がふわっと現れる演出
========================================= */
(function () {
  const revealSelectors = [
    '.hero-eyebrow', '.hero h1', '.hero p.lead', '.hero-cta',
    '.section .eyebrow', '.section > .wrap > h2', '.section .desc',
    '.about-feature', '.material-card', '.cycle-step', '.timeline-step',
    '.article-card', '.stat-card', '.price-card',
    '.persona-list li', '.week-row', '.feature-checklist li', '.callout-box'
  ];

  const els = document.querySelectorAll(revealSelectors.join(','));
  if (!els.length) return;

  els.forEach((el, i) => {
    el.classList.add('solvia-reveal');
    el.style.transitionDelay = (i % 6) * 0.08 + 's';
  });

  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
})();

/* =========================================
   ヒーロー：漂う光の粒子演出
========================================= */
(function () {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'hero-particles';
  hero.prepend(canvas);
  const ctx = canvas.getContext('2d');

  let w, h, particles;

  function resize() {
    w = canvas.width = hero.offsetWidth;
    h = canvas.height = hero.offsetHeight;
  }

  function makeParticles() {
    const count = Math.max(18, Math.round(w / 60));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.6,
      speed: Math.random() * 0.35 + 0.08,
      drift: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.2
    }));
  }

  function tick() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#4fb3e0';
    particles.forEach(p => {
      p.y -= p.speed;
      p.x += p.drift;
      if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w; }
      if (p.x < -4) p.x = w + 4;
      if (p.x > w + 4) p.x = -4;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }

  resize();
  makeParticles();
  tick();

  window.addEventListener('resize', () => {
    resize();
    makeParticles();
  });
})();

/* =========================================
   数字のカウントアップ演出
   使い方: <span data-counter="500" data-counter-suffix="+">0</span>
========================================= */
(function () {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-counter'), 10);
    const suffix = el.getAttribute('data-counter-suffix') || '';
    const duration = 1400;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(el => io.observe(el));
})();