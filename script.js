// ===== MantêGo site — interações =====
(function () {
  const nav = document.querySelector('.nav');

  // Header solidifica ao rolar
  const onScroll = () => {
    if (window.scrollY > 12) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menu mobile
  const toggle = document.querySelector('.menu-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
    nav.querySelectorAll('.nav-links a').forEach(a =>
      a.addEventListener('click', () => nav.classList.remove('open'))
    );
  }

  // Revelação no scroll
  const reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  // Parallax suave na imagem do hero
  const heroImg = document.querySelector('.hero-right img');
  if (heroImg && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) heroImg.style.transform = 'translateY(' + y * 0.08 + 'px) scale(1.04)';
    }, { passive: true });
  }

  // Frase do hero "cai e se desfaz" conforme o scroll
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const words = [].slice.call(heroTitle.querySelectorAll('.w'));
    let ticking = false;
    const apply = () => {
      const vh = window.innerHeight || 1;
      const p = Math.min(1, Math.max(0, window.scrollY / (vh * 0.78)));
      words.forEach((w, i) => {
        const fall = p * (22 + i * 28);                 // cada palavra cai um pouco mais (escalonado)
        const rot = (i % 2 ? 1 : -1) * p * p * 7;        // leve rotação = "se desfazendo"
        w.style.transform = 'translateY(' + fall.toFixed(1) + 'px) rotate(' + rot.toFixed(2) + 'deg)';
        w.style.opacity = Math.max(0, 1 - p * 1.3).toFixed(3);
        w.style.filter = 'blur(' + (p * p * 6).toFixed(1) + 'px)';
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(apply); ticking = true; }
    }, { passive: true });
    apply();
  }

  // Botões de "compra" (demo) — feedback visual
  document.querySelectorAll('[data-buy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const original = btn.textContent;
      btn.textContent = 'Adicionado ✓';
      btn.style.background = 'var(--gold-deep)';
      btn.style.color = '#fff';
      setTimeout(() => { btn.textContent = original; btn.style.background = ''; btn.style.color = ''; }, 1600);
    });
  });
})();
