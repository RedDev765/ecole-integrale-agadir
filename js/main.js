// === SCROLL PROGRESS BAR ===
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
document.body.prepend(scrollProgress);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = progress + '%';
}, { passive: true });

// === NAV TOGGLE ===
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
  document.querySelectorAll('.nav-list a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// === HEADER SCROLL SHRINK ===
const header = document.querySelector('.header');
if (header) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle('shrink', window.scrollY > 200);
        header.classList.toggle('scrolled', window.scrollY > 50);
        ticking = false;
      });
      ticking = true;
    }
  });
}

// === ACTIVE NAV LINK ===
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-list a').forEach(link => {
  if (link.getAttribute('href') === currentPath) link.classList.add('active');
});

// === DARK / LIGHT MODE ===
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️';
  }
  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      themeToggle.textContent = '🌙';
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      themeToggle.textContent = '☀️';
    }
  });
}

// === SCROLL REVEAL ===
const revealElements = [];

function trackReveal(el, delay) {
  if (delay) el.style.transitionDelay = delay;
  revealElements.push(el);
}

document.querySelectorAll('.feature-card, .program-card, .team-card, .blog-card, .parents-card, .testimonial-card, .day-card, .section-header, .contact-grid > div').forEach((el, i) => {
  el.classList.add('reveal');
  trackReveal(el, `${i * 0.1}s`);
});
document.querySelectorAll('.about-grid .about-content').forEach(el => { el.classList.add('reveal-left'); trackReveal(el); });
document.querySelectorAll('.about-grid .about-image-wrap, .about-grid .about-image').forEach(el => { el.classList.add('reveal-right'); trackReveal(el); });

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1 });

revealElements.forEach(el => {
  const rect = el.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    el.classList.add('visible');
  } else {
    revealObserver.observe(el);
  }
});

// === TIMELINE SCROLL REVEAL ===
document.querySelectorAll('.timeline-step, .day-step').forEach((el, i) => {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 150);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  obs.observe(el);
});

// === COUNTER ANIMATION WITH RING ===
function animateCounter(el) {
  const target = parseInt(el.textContent.replace(/[^0-9]/g, ''), 10);
  const suffix = el.textContent.replace(/[0-9]/g, '').trim();
  if (isNaN(target) || target <= 0) return;
  let current = 0;
  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    current = Math.round(progress * target);
    el.textContent = current + (suffix ? ' ' + suffix : '');
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target + (suffix ? ' ' + suffix : '');
    }
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      const ring = entry.target.closest('.stat-item')?.querySelector('.stat-ring-fill');
      if (ring) ring.classList.add('animate');
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => {
  const statItem = el.closest('.stat-item');
  if (statItem && !statItem.querySelector('.stat-ring')) {
    const ringSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    ringSvg.setAttribute('viewBox', '0 0 48 48');
    ringSvg.classList.add('stat-ring');
    const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bgCircle.setAttribute('cx', '24'); bgCircle.setAttribute('cy', '24'); bgCircle.setAttribute('r', '20');
    bgCircle.classList.add('stat-ring-bg');
    const fillCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    fillCircle.setAttribute('cx', '24'); fillCircle.setAttribute('cy', '24'); fillCircle.setAttribute('r', '20');
    fillCircle.classList.add('stat-ring-fill');
    ringSvg.appendChild(bgCircle);
    ringSvg.appendChild(fillCircle);
    statItem.appendChild(ringSvg);
  }
  counterObserver.observe(el);
});

// === HERO INTERACTIVE PARTICLES ===
const oldParticles = document.querySelector('.hero-particles');
if (oldParticles) {
  // Remove old floating particles
  oldParticles.innerHTML = '';

  const particles = [];
  const mouse = { x: 0, y: 0 };

  document.addEventListener('mousemove', (e) => {
    const rect = oldParticles.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
  });

  for (let i = 0; i < 30; i++) {
    const p = {
      x: Math.random() * 100, y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6,
      size: 2 + Math.random() * 4, el: null
    };
    const el = document.createElement('div');
    el.className = 'particle';
    el.style.cssText = `left:${p.x}%;top:${p.y}%;width:${p.size}px;height:${p.size}px;opacity:0.6;background:${Math.random() > 0.5 ? 'var(--gold-light)' : 'rgba(255,255,255,0.3)'}`;
    oldParticles.appendChild(el);
    p.el = el;
    particles.push(p);
  }

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
  oldParticles.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = oldParticles.offsetWidth;
    canvas.height = oldParticles.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const w = canvas.width / 100, h = canvas.height / 100;

    particles.forEach((p, i) => {
      p.x += p.vx + mouse.x * 0.04;
      p.y += p.vy + mouse.y * 0.04;
      if (p.x < 0 || p.x > 100) p.vx *= -1;
      if (p.y < 0 || p.y > 100) p.vy *= -1;
      p.el.style.left = p.x + '%';
      p.el.style.top = p.y + '%';

      particles.forEach((p2, j) => {
        if (j <= i) return;
        const dx = (p.x - p2.x) * w, dy = (p.y - p2.y) * h;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(201,168,76,${0.15 * (1 - dist / 150)})`;
          ctx.lineWidth = 1;
          ctx.moveTo(p.x * w, p.y * h);
          ctx.lineTo(p2.x * w, p2.y * h);
          ctx.stroke();
        }
      });
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

// === MOUSE PARALLAX ON CARDS ===
document.querySelectorAll('.feature-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  });
});

// === SMOOTH ANCHOR SCROLL ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#' || !href) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// === AUDIO WELCOME (plays on first interaction) ===
(function playWelcomeOnInteraction() {
  let played = false;
  function playMelody() {
    if (played) return;
    played = true;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const now = ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25];
      notes.forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = freq;
        g.gain.setValueAtTime(0, now + i * 0.3);
        g.gain.linearRampToValueAtTime(0.12, now + i * 0.3 + 0.05);
        g.gain.linearRampToValueAtTime(0, now + i * 0.3 + 0.25);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(now + i * 0.3);
        o.stop(now + i * 0.3 + 0.3);
      });
    } catch(e) {}
  }
  document.addEventListener('click', playMelody, { once: true });
  document.addEventListener('touchstart', playMelody, { once: true });
})();
