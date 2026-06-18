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

  // ===== Calculadora "tempo gasto com manteiga" (só na calculadora.html) =====
  const calcForm = document.getElementById('calc-form');
  if (calcForm) {
    // Premissas (segundos por vez). Trocar aqui se quiser ajustar.
    const SEG_PASSAR_NORMAL = 60;   // 1 min passando com a faca
    const SEG_LAVAR_FACA   = 30;    // 30 s lavando a faca
    const SEG_PASSAR_MANTEGO = 10;  // 10 s com o MantêGo (sem faca)
    const MESES = 12, ANOS = 80;

    const input = document.getElementById('calc-input');
    const result = document.getElementById('calc-result');
    const fmt = n => Math.round(n).toLocaleString('pt-BR');
    const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };

    calcForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let n = parseInt(input.value, 10);
      if (!n || n < 1) { input.focus(); return; }
      n = Math.min(n, 200);

      const usos = n * MESES * ANOS;                  // vezes ao longo da vida
      const hPassar  = usos * SEG_PASSAR_NORMAL / 3600;
      const hLavar   = usos * SEG_LAVAR_FACA   / 3600;
      const hNormal  = hPassar + hLavar;
      const hMantego = usos * SEG_PASSAR_MANTEGO / 3600;
      const hEcon    = hNormal - hMantego;

      set('r-passar', fmt(hPassar) + ' h');
      set('r-lavar', fmt(hLavar) + ' h');
      set('r-normal', fmt(hNormal));
      set('r-mantego', fmt(hMantego));
      set('r-normal-days', '≈ ' + fmt(hNormal / 24) + ' dias inteiros');
      set('r-mantego-days', '≈ ' + fmt(hMantego / 24) + ' dias');
      set('r-economia', fmt(hEcon) + ' horas');
      set('r-economia-days', fmt(hEcon / 24));

      result.classList.add('show');
      requestAnimationFrame(() => result.scrollIntoView({ behavior: 'smooth', block: 'center' }));
    });
  }
})();
