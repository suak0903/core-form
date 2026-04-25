/* core:form — main.js */

/* ─── NAV: transparent → white on scroll, logo swap via CSS class ─── */
const nav = document.getElementById('nav');
const SCROLL_THRESHOLD = 60;

function updateNav() {
  nav.classList.toggle('scrolled', window.scrollY > SCROLL_THRESHOLD);
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ─── NAV: mobile toggle ─── */
const toggle    = document.querySelector('.nav__toggle');
const mobileMenu = document.getElementById('mobileMenu');

toggle?.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  toggle.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
  mobileMenu.setAttribute('aria-hidden', String(!open));
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });
});

/* ─── SCROLL REVEAL ─── */
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* Hero elements animate in immediately on load */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('visible'));
});

/* ─── SMOOTH SCROLL ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - nav.offsetHeight - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─── CONTACT FORM ─── */
const form = document.querySelector('.kontakt__form');
form?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  const orig = btn.textContent;
  btn.textContent = 'Gesendet ✓';
  btn.disabled = true;
  btn.style.background = '#1a6639';
  btn.style.borderColor = '#1a6639';
  setTimeout(() => {
    btn.textContent = orig;
    btn.disabled = false;
    btn.style.background = '';
    btn.style.borderColor = '';
    form.reset();
  }, 4000);
});

/* ─── SUBTLE HERO PARALLAX ─── */
const heroImg = document.querySelector('.hero__img');
if (heroImg && matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  window.addEventListener('scroll', () => {
    heroImg.style.transform = `translateY(${window.scrollY * 0.2}px)`;
  }, { passive: true });
}
