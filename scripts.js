
// ============================================================================
// AFFILIATE INSIDER - Interactive Features
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all features
  initParticles();
  initSearch();
  initFilters();
  initScrollTop();
  initCardAnimations();
  initCountUp();
});

// ----------------------------------------------------------------------------
// PARTICLE BACKGROUND
// ----------------------------------------------------------------------------
function initParticles() {
  const container = document.querySelector('.particles');
  if (!container) return;
  
  const particleCount = 30;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 8 + 's';
    particle.style.animationDuration = (6 + Math.random() * 4) + 's';
    
    // Random colors
    const colors = ['#00d4ff', '#a855f7', '#fbbf24', '#22c55e'];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.boxShadow = `0 0 6px ${particle.style.background}`;
    
    container.appendChild(particle);
  }
}

// ----------------------------------------------------------------------------
// SEARCH FUNCTIONALITY
// ----------------------------------------------------------------------------
function initSearch() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;
  
  let debounceTimer;
  
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const query = e.target.value.toLowerCase().trim();
      filterCards(query);
    }, 200);
  });
}

function filterCards(query) {
  const cards = document.querySelectorAll('.card');
  let visibleCount = 0;
  
  cards.forEach(card => {
    const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
    const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
    const tags = card.querySelector('.tags')?.textContent.toLowerCase() || '';
    
    const matches = !query || 
      title.includes(query) || 
      desc.includes(query) || 
      tags.includes(query);
    
    if (matches) {
      card.style.display = '';
      card.style.animation = 'card-appear 0.4s ease forwards';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });
  
  // Update results count if element exists
  const resultsCount = document.getElementById('results-count');
  if (resultsCount) {
    resultsCount.textContent = `${visibleCount} result${visibleCount !== 1 ? 's' : ''}`;
  }
}

// ----------------------------------------------------------------------------
// FILTER PILLS
// ----------------------------------------------------------------------------
function initFilters() {
  const filterPills = document.querySelectorAll('.filter-pill');
  
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      // Toggle active state
      const wasActive = pill.classList.contains('active');
      
      // Remove active from all if clicking different pill
      if (!wasActive) {
        filterPills.forEach(p => p.classList.remove('active'));
      }
      
      pill.classList.toggle('active');
      
      // Get filter value
      const filter = pill.classList.contains('active') ? 
        pill.dataset.filter?.toLowerCase() : '';
      
      filterCardsByCategory(filter);
    });
  });
}

function filterCardsByCategory(category) {
  const cards = document.querySelectorAll('.card');
  
  cards.forEach(card => {
    const tags = card.querySelector('.tags')?.textContent.toLowerCase() || '';
    const matches = !category || tags.includes(category);
    
    if (matches) {
      card.style.display = '';
      card.style.animation = 'card-appear 0.4s ease forwards';
    } else {
      card.style.display = 'none';
    }
  });
}

// ----------------------------------------------------------------------------
// SCROLL TO TOP
// ----------------------------------------------------------------------------
function initScrollTop() {
  const scrollBtn = document.querySelector('.scroll-top');
  if (!scrollBtn) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  });
  
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ----------------------------------------------------------------------------
// CARD INTERSECTION ANIMATIONS
// ----------------------------------------------------------------------------
function initCardAnimations() {
  if (!('IntersectionObserver' in window)) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.card').forEach(card => {
    card.style.animationPlayState = 'paused';
    observer.observe(card);
  });
}

// ----------------------------------------------------------------------------
// ANIMATED COUNT UP FOR STATS
// ----------------------------------------------------------------------------
function initCountUp() {
  const stats = document.querySelectorAll('.stat-value[data-count]');
  
  if (!('IntersectionObserver' in window)) {
    stats.forEach(stat => {
      stat.textContent = stat.dataset.count;
    });
    return;
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.count);
        animateCount(entry.target, target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  stats.forEach(stat => observer.observe(stat));
}

function animateCount(element, target) {
  const duration = 1500;
  const start = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(easeOut * target);
    
    element.textContent = current.toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target.toLocaleString();
    }
  }
  
  requestAnimationFrame(update);
}

// ----------------------------------------------------------------------------
// KEYBOARD NAVIGATION
// ----------------------------------------------------------------------------
document.addEventListener('keydown', (e) => {
  // Focus search on '/'
  if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
    const searchInput = document.getElementById('search-input');
    if (searchInput && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
  }
  
  // Close search on Escape
  if (e.key === 'Escape') {
    const searchInput = document.getElementById('search-input');
    if (searchInput && document.activeElement === searchInput) {
      searchInput.blur();
      searchInput.value = '';
      filterCards('');
    }
  }
});

// ----------------------------------------------------------------------------
// SMOOTH LINK TRANSITIONS
// ----------------------------------------------------------------------------
document.querySelectorAll('a[href^="/"], a[href^="./"]').forEach(link => {
  link.addEventListener('click', function(e) {
    // Add page transition effect
    document.body.style.opacity = '0.8';
    document.body.style.transition = 'opacity 0.2s ease';
  });
});
