// ============================================================================
// AFFILIATE INSIDER - Cyberpunk Interactive Features
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  initMatrixRain();
  initFloatingParticles();
  initCard3DTilt();
  initGlitchText();
  initSearch();
  initFilters();
  initScrollTop();
  initCardAnimations();
  initCountUp();
});

// ----------------------------------------------------------------------------
// MATRIX RAIN CANVAS
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
  window.addEventListener('resize', resize);

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()アイウエオカキクケコサシスセソ';
  const fontSize = 13;
  let columns = Math.floor(canvas.width / fontSize);
  let drops = Array(columns).fill(1);

  function draw() {
    ctx.fillStyle = 'rgba(10,10,15,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize}px JetBrains Mono, monospace`;

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      const r = Math.random();
      ctx.fillStyle = r > 0.98 ? '#ffffff' : r > 0.9 ? '#00ffd5' : '#39ff14';
      ctx.fillText(char, x, y);

      if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }

  setInterval(draw, 50);
}

// ----------------------------------------------------------------------------
// FLOATING PARTICLES
// ----------------------------------------------------------------------------
function initFloatingParticles() {
  const colors = ['#00ffd5', '#ff00ff', '#39ff14', '#ffd700'];
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 1;
    const color = colors[Math.floor(Math.random() * colors.length)];
    Object.assign(p.style, {
      width:  size + 'px',
      height: size + 'px',
      left:   Math.random() * 100 + '%',
      top:    Math.random() * 100 + '%',
      background: color,
      boxShadow: `0 0 6px ${color}`,
      '--dur':   (10 + Math.random() * 15) + 's',
      '--delay': (Math.random() * 8) + 's',
    });
    document.body.appendChild(p);
  }
}

// ----------------------------------------------------------------------------
// 3D CARD TILT
// ----------------------------------------------------------------------------
function initCard3DTilt() {
  document.querySelectorAll('.card').forEach(card => {
    // Add glow overlay if not present
    if (!card.querySelector('.card-glow-overlay')) {
      const overlay = document.createElement('div');
      overlay.className = 'card-glow-overlay';
      card.appendChild(overlay);
    }

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX =  (y - cy) / 12;
      const rotY = -(x - cx) / 12;
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
      card.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease-out';
    });
  });
}

// ----------------------------------------------------------------------------
// GLITCH TEXT EFFECT
// ----------------------------------------------------------------------------
function initGlitchText() {
  document.querySelectorAll('.glitch').forEach(el => {
    if (!el.dataset.text) el.dataset.text = el.textContent;
    
    setInterval(() => {
      if (Math.random() > 0.96) {
        el.style.transform = `translateX(${(Math.random()-0.5)*6}px)`;
        setTimeout(() => { el.style.transform = ''; }, 80);
      }
    }, 150);
  });
}

// ----------------------------------------------------------------------------
// SEARCH
// ----------------------------------------------------------------------------
function initSearch() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;

  let debounceTimer;
  searchInput.addEventListener('input', e => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => filterCards(e.target.value.toLowerCase().trim()), 200);
  });
}

function filterCards(query) {
  let visible = 0;
  document.querySelectorAll('.card').forEach(card => {
    const text = (card.textContent || '').toLowerCase();
    const match = !query || text.includes(query);
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
  const pills = document.querySelectorAll('.filter-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const wasActive = pill.classList.contains('active');
      pills.forEach(p => p.classList.remove('active'));
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
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.card').forEach(card => {
    card.style.animationPlayState = 'paused';
    obs.observe(card);
  });
}

// ----------------------------------------------------------------------------
// COUNT UP ANIMATION
// ----------------------------------------------------------------------------
function initCountUp() {
  const stats = document.querySelectorAll('.stat-value[data-count], .trust-stat-num[data-count]');
  if (!('IntersectionObserver' in window)) {
    stats.forEach(s => s.textContent = s.dataset.count);
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target, parseInt(entry.target.dataset.count));
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  stats.forEach(s => obs.observe(s));
}

function animateCount(el, target) {
  const dur = 1500;
  const start = performance.now();
  (function update(now) {
    const t = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.floor(ease * target).toLocaleString();
    if (t < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString();
  })(start);
}

// ----------------------------------------------------------------------------
// KEYBOARD SHORTCUTS
// ----------------------------------------------------------------------------
document.addEventListener('keydown', e => {
  const search = document.getElementById('search-input');
  if (e.key === '/' && search && document.activeElement !== search) {
    e.preventDefault();
    search.focus();
  }
  if (e.key === 'Escape' && search && document.activeElement === search) {
    search.blur();
    search.value = '';
    filterCards('');
  }
});

// ----------------------------------------------------------------------------
// SMOOTH TRANSITIONS
// ----------------------------------------------------------------------------
document.querySelectorAll('a[href^="/"], a[href^="./"]').forEach(link => {
  link.addEventListener('click', () => {
    document.body.style.opacity = '0.7';
    document.body.style.transition = 'opacity 0.2s ease';
  });
});
