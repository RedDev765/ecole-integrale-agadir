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

// === SCROLL REVEAL ===
const revealElements = [];

function trackReveal(el, delay) {
  if (delay) el.style.transitionDelay = delay;
  revealElements.push(el);
}

document.querySelectorAll('.feature-card, .program-card, .team-card, .blog-card, .parents-card, .section-header, .contact-grid > div').forEach((el, i) => {
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

// === COUNTER ANIMATION ===
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
    const size = 2 + Math.random() * 4;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
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
    if (href === '#' || !href) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
