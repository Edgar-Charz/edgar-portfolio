const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

function setTheme(theme) {
  root.dataset.theme = theme;
  themeIcon.textContent = theme === 'dark' ? '☼' : '☾';
  themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  try { localStorage.setItem('portfolio-theme', theme); } catch (error) {}
}
setTheme(root.dataset.theme || 'dark');
themeToggle.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

if (
  'IntersectionObserver' in window &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches
) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(
    '.section-heading, .about-lead, .about-carousel, .about-details, .skill-card, .project-card, .contact-panel'
  ).forEach(element => {
    element.classList.add('reveal');
    revealObserver.observe(element);
  });
}

document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
    });
  });
});

const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach(section => observer.observe(section));
document.getElementById('year').textContent = new Date().getFullYear();

// About photo slideshow: supports autoplay, arrows, dots, keyboard focus and touch swipe.
(() => {
  const carousel = document.querySelector('.about-carousel');
  if (!carousel) return;
  const slides = [...carousel.querySelectorAll('.about-slide')];
  const dots = [...carousel.querySelectorAll('.about-dot')];
  const previous = carousel.querySelector('.about-slide-arrow.prev');
  const next = carousel.querySelector('.about-slide-arrow.next');
  let current = 0, timer, touchStart = 0;
  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
    dots.forEach((dot, i) => { dot.classList.toggle('active', i === current); dot.setAttribute('aria-pressed', String(i === current)); });
  }
  function stop(){ clearInterval(timer); }
  function start(){ stop(); timer = setInterval(() => show(current + 1), 5000); }
  previous?.addEventListener('click', () => { show(current - 1); start(); });
  next?.addEventListener('click', () => { show(current + 1); start(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { show(i); start(); }));
  carousel.addEventListener('mouseenter', stop); carousel.addEventListener('mouseleave', start);
  carousel.addEventListener('focusin', stop); carousel.addEventListener('focusout', start);
  carousel.addEventListener('touchstart', e => { touchStart = e.changedTouches[0].clientX; stop(); }, {passive:true});
  carousel.addEventListener('touchend', e => { const delta = e.changedTouches[0].clientX - touchStart; if (Math.abs(delta) > 45) show(current + (delta < 0 ? 1 : -1)); start(); }, {passive:true});
  show(0); start();
})();
