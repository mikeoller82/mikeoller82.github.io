// ============================================================================
// AFFILIATE INSIDER - Cyberpunk Interactive Features v2.0
// NeuralNexus-inspired: Matrix rain, particle network, 3D tilt, glitch
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  initMatrixRain();
  initParticleNetwork();
  initCard3DTilt();
  initGlitchText();
  initSearch();
  initFilters();
  initScrollTop();
  initCardAnimations();
  initCountUp();
  initSmoothTransitions();
});

// ----------------------------------------------------------------------------
// MATRIX RAIN — full canvas background
// ----------------------------------------------------------------------------
function initMatrixRain() {
  let canvas = document.getElementById('matrix-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'matrix-canvas';
    document.body.prepend(canvas);
  }
  const ctx = canvas.getContext('2d');

  const resize = () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', () => { resize(); drops = Array(Math.floor(canvas.width / fontSize)).fill(1); });

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*アイウエオカキクケコサシスセソ';
  const fontSize = 13;
  let drops = Array(Math.floor(canvas.width / fontSize)).fill(1);
  const colors = ['#00ffd5', '#00ffd5', '#00ffd5', '#39ff14', '#ff00ff', '#ffffff'];

  setInterval(() => {
    ctx.fillStyle = 'rgba(10,10,15,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fontSize}px JetBrains Mono, monospace`;
    for (let i = 0; i < drops.length; i++) {
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }, 50);
}

// ----------------------------------------------------------------------------
// PARTICLE NETWORK — floating connected particles
// ----------------------------------------------------------------------------
function initParticleNetwork() {
  let canvas = document.getElementById('particle-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    document.body.insertBefore(canvas, document.body.children[1] || null);
  }
  const ctx = canvas.getContext('2d');

  const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
  resize();
  window.addEventListener('resize', resize);

  const colors = ['#00ffd5', '#ff00ff', '#39ff14', '#ffd700'];
  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    size: Math.random() * 2.5 + 0.5,
    color: colors[Math.floor(Math.random() * colors.length)],
    alpha: Math.random() * 0.4 + 0.15,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    });
    // Draw connection lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.beginPath();
          ctx.strokeStyle = particles[i].color;
          ctx.globalAlpha = 0.08 * (1 - dist / 140);
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// ----------------------------------------------------------------------------
// 3D CARD TILT with glow overlay
// ----------------------------------------------------------------------------
function initCard3DTilt() {
  document.querySelectorAll('.card').forEach(card => {
    if (!card.querySelector('.card-glow-overlay')) {
      const overlay = document.createElement('div');
      overlay.className = 'card-glow-overlay';
      card.appendChild(overlay);
    }
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotX =  (y - rect.height / 2) / 12;
      const rotY = -(x - rect.width  / 2) / 12;
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`;
      card.style.transition = 'transform 0.08s ease-out';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
      card.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1)';
    });
  });
}

// ----------------------------------------------------------------------------
// GLITCH TEXT — random jitter + color flash
// ----------------------------------------------------------------------------
function initGlitchText() {
  document.querySelectorAll('.glitch').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent;
    setInterval(() => {
      if (Math.random() > 0.95) {
        el.style.transform = `translate(${(Math.random()-0.5)*5}px, ${(Math.random()-0.5)*3}px)`;
        el.style.filter = Math.random() > 0.5 ? 'hue-rotate(90deg)' : '';
        setTimeout(() => { el.style.transform = ''; el.style.filter = ''; }, 80);
      }
    }, 160);
  });
}

// ----------------------------------------------------------------------------
// SEARCH
// ----------------------------------------------------------------------------
function initSearch() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;
  let timer;
  searchInput.addEventListener('input', e => {
    clearTimeout(timer);
    timer = setTimeout(() => filterCards(e.target.value.toLowerCase().trim()), 200);
  });
}

function filterCards(query) {
  let visible = 0;
  document.querySelectorAll('.card').forEach(card => {
    const match = !query || card.textContent.toLowerCase().includes(query);
    card.style.display = match ? '' : 'none';
    if (match) visible++;
  });
  const el = document.getElementById('results-count');
  if (el) el.textContent = `${visible} result${visible !== 1 ? 's' : ''}`;
}

// ----------------------------------------------------------------------------
// FILTER PILLS
// ----------------------------------------------------------------------------
function initFilters() {
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const wasActive = pill.classList.contains('active');
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      if (!wasActive) pill.classList.add('active');
      const filter = pill.classList.contains('active') ? pill.dataset.filter?.toLowerCase() : '';
      document.querySelectorAll('.card').forEach(card => {
        const tags = (card.querySelector('.tags')?.textContent || '').toLowerCase();
        card.style.display = !filter || tags.includes(filter) ? '' : 'none';
      });
    });
  });
}

// ----------------------------------------------------------------------------
// SCROLL TO TOP
// ----------------------------------------------------------------------------
function initScrollTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 500));
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ----------------------------------------------------------------------------
// CARD INTERSECTION ANIMATIONS
// ----------------------------------------------------------------------------
function initCardAnimations() {
  if (!('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.style.animationPlayState = 'running'; obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.card').forEach(c => { c.style.animationPlayState = 'paused'; obs.observe(c); });
}

// ----------------------------------------------------------------------------
// COUNT UP ANIMATION
// ----------------------------------------------------------------------------
function initCountUp() {
  const els = document.querySelectorAll('[data-count]');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.textContent = e.dataset.count); return; }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animateCount(e.target, parseInt(e.target.dataset.count)); obs.unobserve(e.target); }});
  }, { threshold: 0.5 });
  els.forEach(e => obs.observe(e));
}

function animateCount(el, target) {
  const dur = 1500, start = performance.now();
  (function tick(now) {
    const t = Math.min((now - start) / dur, 1);
    el.textContent = Math.floor((1 - Math.pow(1 - t, 3)) * target).toLocaleString();
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString();
  })(start);
}

// ----------------------------------------------------------------------------
// SMOOTH PAGE TRANSITIONS + KEYBOARD SHORTCUTS
// ----------------------------------------------------------------------------
function initSmoothTransitions() {
  document.querySelectorAll('a[href^="/"], a[href^="./"]').forEach(link => {
    link.addEventListener('click', () => { document.body.style.opacity = '0.7'; document.body.style.transition = 'opacity 0.2s ease'; });
  });
  document.addEventListener('keydown', e => {
    const s = document.getElementById('search-input');
    if (e.key === '/' && s && document.activeElement !== s) { e.preventDefault(); s.focus(); }
    if (e.key === 'Escape' && s && document.activeElement === s) { s.blur(); s.value = ''; filterCards(''); }
  });
}
