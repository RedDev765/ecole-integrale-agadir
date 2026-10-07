// === SCROLL PROGRESS BAR ===
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
scrollProgress.setAttribute('aria-hidden', 'true');
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
  }, { passive: true });
}

// === SCROLL REVEAL ===
const revealElements = [];

function trackReveal(el, delay) {
  if (delay) el.style.transitionDelay = delay;
  revealElements.push(el);
}

document.querySelectorAll('.feature-card, .program-card, .testimonial-card, .section-header, .contact-grid > div').forEach((el, i) => {
  el.classList.add('reveal');
  trackReveal(el, `${i * 0.1}s`);
});
// FAQ : apparition en cascade au scroll
document.querySelectorAll('.faq-item').forEach((el, i) => {
  el.classList.add('reveal');
  trackReveal(el, `${i * 0.06}s`);
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
document.querySelectorAll('.timeline-step, .day-step, .step-h').forEach((el, i) => {
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
    el.textContent = current + suffix;
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target + suffix;
    }
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      // Barre de progression : la largeur vient de data-progress sur .stat-item
      const fill = entry.target.closest('.stat-item')?.querySelector('.stat-bar-fill');
      if (fill) fill.style.width = (fill.dataset.progress || 100) + '%';
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => {
  const statItem = el.closest('.stat-item');
  if (statItem && !statItem.querySelector('.stat-bar')) {
    const bar = document.createElement('div');
    bar.className = 'stat-bar';
    bar.setAttribute('aria-hidden', 'true');
    const fill = document.createElement('span');
    fill.className = 'stat-bar-fill';
    fill.dataset.progress = statItem.dataset.progress || '100';
    bar.appendChild(fill);
    statItem.appendChild(bar);
  }
  counterObserver.observe(el);
});

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


