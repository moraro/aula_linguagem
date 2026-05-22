/**
 * script.js — Vinícius Moraro Portfolio
 * Funcionalidades: navbar, typed effect, scroll reveal,
 * skill bars, counter, hamburger, back-to-top, form.
 */

/* ═══════════════════════════════════════════
   1. NAVBAR — scroll effect + active link
═══════════════════════════════════════════ */
const navbar  = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function handleNavScroll() {
  /* Scrolled style */
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  /* Active link highlight */
  let current = '';
  sections.forEach(section => {
    const top    = section.offsetTop - 120;
    const bottom = top + section.offsetHeight;
    if (window.scrollY >= top && window.scrollY < bottom) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll(); // run once on load

/* ═══════════════════════════════════════════
   2. HAMBURGER MENU (mobile)
═══════════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});

/* Close menu when a link is clicked */
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});

/* Close on outside click */
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  }
});

/* ═══════════════════════════════════════════
   3. TYPED TEXT EFFECT
═══════════════════════════════════════════ */
const phrases  = [
  'Desenvolvedor Front-End',
  'Estudante de Sistemas',
  'Criador de Soluções',
  'Apaixonado por Tech',
  'Full Stack em progresso...',
];

let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;
const typedEl   = document.getElementById('typed');

function typeLoop() {
  if (!typedEl) return;

  const currentPhrase = phrases[phraseIndex];

  if (!isDeleting) {
    typedEl.textContent = currentPhrase.slice(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentPhrase.length) {
      isDeleting = true;
      setTimeout(typeLoop, 2000); // pause at end
      return;
    }
  } else {
    typedEl.textContent = currentPhrase.slice(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(typeLoop, 400);
      return;
    }
  }

  const speed = isDeleting ? 50 : 80;
  setTimeout(typeLoop, speed);
}

// Start after short delay
setTimeout(typeLoop, 1000);

/* ═══════════════════════════════════════════
   4. SCROLL REVEAL
═══════════════════════════════════════════ */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Trigger skill bars when skill cards become visible
        triggerSkillBars(entry.target);
        // Trigger counters when stat nums become visible
        triggerCounters(entry.target);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));

/* ═══════════════════════════════════════════
   5. SKILL BARS ANIMATION
═══════════════════════════════════════════ */
function triggerSkillBars(el) {
  // If the revealed element is or contains a skill-card
  const fills = el.querySelectorAll
    ? el.querySelectorAll('.skill-fill')
    : [];

  fills.forEach(fill => {
    const target = fill.getAttribute('data-w');
    if (target) {
      setTimeout(() => {
        fill.style.width = target + '%';
      }, 100);
    }
  });
}

/* Also directly observe all skill fills for safety */
const skillFills = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const w = entry.target.getAttribute('data-w');
        if (w) {
          setTimeout(() => { entry.target.style.width = w + '%'; }, 150);
        }
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);
skillFills.forEach(el => skillObserver.observe(el));

/* ═══════════════════════════════════════════
   6. NUMBER COUNTER ANIMATION
═══════════════════════════════════════════ */
function triggerCounters(el) {
  const statNums = el.querySelectorAll
    ? el.querySelectorAll('.stat-num')
    : [];

  statNums.forEach(num => animateCounter(num));
}

function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1400; // ms
  const step     = 16;   // ~60fps
  const steps    = duration / step;
  const increment = target / steps;
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, step);
}

/* Observe stat nums directly */
const statNums = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.8 }
);
statNums.forEach(el => counterObserver.observe(el));

/* ═══════════════════════════════════════════
   7. BACK TO TOP BUTTON
═══════════════════════════════════════════ */
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
}, { passive: true });

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ═══════════════════════════════════════════
   8. SMOOTH ANCHOR SCROLLING (for older Safari)
═══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const targetId = anchor.getAttribute('href');
    const target   = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = 80; // navbar height
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ═══════════════════════════════════════════
   9. CONTACT FORM — mock submit
═══════════════════════════════════════════ */
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;

    // Loading state
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
    btn.disabled  = true;

    // Simulate async send
    setTimeout(() => {
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Mensagem enviada!';
      btn.style.background = '#10b981';
      btn.style.boxShadow  = '0 0 20px rgba(16,185,129,0.4)';

      // Reset after 3s
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled  = false;
        btn.style.background = '';
        btn.style.boxShadow  = '';
        contactForm.reset();
      }, 3000);
    }, 1600);
  });
}

/* ═══════════════════════════════════════════
   10. HERO CODE CARD — subtle parallax on mouse
═══════════════════════════════════════════ */
const codeCard = document.querySelector('.hero-code-card');

if (codeCard && window.innerWidth > 1024) {
  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    codeCard.style.transform = `
      translateY(-50%)
      rotateY(${dx * -6}deg)
      rotateX(${dy * 4}deg)
      translateZ(0)
    `;
    codeCard.style.transition = 'transform 0.15s ease';
  });

  document.addEventListener('mouseleave', () => {
    codeCard.style.transform = 'translateY(-50%)';
    codeCard.style.transition = 'transform 0.6s ease';
  });
}

/* ═══════════════════════════════════════════
   11. INIT — run on DOMContentLoaded
═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Stagger reveal for elements already in viewport on load
  setTimeout(() => {
    revealEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        el.classList.add('visible');
      }
    });
  }, 200);
});
