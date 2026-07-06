// Navigation
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    nav.classList.toggle('open');
  });
  document.querySelectorAll('.nav-list a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      nav.classList.remove('open');
    });
  });
}

// Header scroll
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
});

// Active nav link
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-list a').forEach(link => {
  if (link.getAttribute('href') === currentPath) link.classList.add('active');
});

// === SCROLL REVEAL ===
const revealElements = [];

function trackReveal(el, delay) {
  if (delay) el.style.transitionDelay = delay;
  revealElements.push(el);
}

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => trackReveal(el));
document.querySelectorAll('.feature-card, .program-card, .team-card, .blog-card').forEach((el, i) => {
  el.classList.add('reveal');
  trackReveal(el, `${i * 0.1}s`);
});
document.querySelectorAll('.about-grid .about-content').forEach(el => { el.classList.add('reveal-left'); trackReveal(el); });
document.querySelectorAll('.about-grid .about-image-wrap').forEach(el => { el.classList.add('reveal-right'); trackReveal(el); });
document.querySelectorAll('.section-header').forEach(el => { el.classList.add('reveal'); trackReveal(el); });
document.querySelectorAll('.parents-card').forEach((el, i) => {
  el.classList.add('reveal');
  trackReveal(el, `${i * 0.15}s`);
});
document.querySelectorAll('.contact-grid > div').forEach((el, i) => {
  el.classList.add('reveal');
  trackReveal(el, `${i * 0.15}s`);
});

// Immediately reveal elements in viewport, observe the rest
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0 });

revealElements.forEach(el => {
  const rect = el.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    el.classList.remove('reveal', 'reveal-left', 'reveal-right', 'reveal-scale');
  } else {
    revealObserver.observe(el);
  }
});

// === COUNTER ANIMATION ===
function animateCounter(el) {
  const target = parseInt(el.textContent.replace(/[^0-9]/g, ''));
  const suffix = el.textContent.replace(/[0-9]/g, '').trim();
  let current = 0;
  const step = Math.ceil(target / 60);
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = current + (suffix ? ' ' + suffix : '');
  }, 25);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number, .hero-stat .num').forEach(el => {
  counterObserver.observe(el);
});

// === HERO PARTICLES ===
const particlesContainer = document.querySelector('.hero-particles');
if (particlesContainer) {
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.width = `${2 + Math.random() * 4}px`;
    particle.style.height = particle.style.width;
    particle.style.animationDuration = `${6 + Math.random() * 10}s`;
    particle.style.animationDelay = `${Math.random() * 8}s`;
    if (Math.random() > 0.5) {
      particle.style.background = 'var(--gold-light)';
    }
    particlesContainer.appendChild(particle);
  }
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
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// === NAVBAR SHRINK ON SCROLL DOWN / EXPAND ON SCROLL UP ===
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (currentScroll > 200) {
    document.querySelector('.header-inner').style.height = '64px';
  } else {
    document.querySelector('.header-inner').style.height = '80px';
  }
  lastScroll = currentScroll;
});

console.log('✨ Intégrale Campus — Premium experience loaded');
