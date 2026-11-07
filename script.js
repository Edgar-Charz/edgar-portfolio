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
    '.section-heading, .about-lead, .technology-orbit, .about-details, .skill-card, .project-card, .contact-panel'
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

const orbitCenter = document.getElementById('orbitCenter');
if (orbitCenter) {
  const orbitMessage = document.getElementById('orbitMessage');
  const orbitSubtitle = document.getElementById('orbitSubtitle');
  const orbitMessages = [
    ['Ideas into<br>useful software', 'LEARN · BUILD · IMPROVE', '#42d9ff'],
    ['From data to solutions', 'DESIGN · DEVELOP · DELIVER', '#a676ff'],
    ['Building for real people', 'THINK · SOLVE · GROW', '#35d9ce'],
    ['Turning challenges into code', 'CREATE · TEST · REFINE', '#45dfa3'],
  ];
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let messageIndex = 0;
    window.setInterval(() => {
      if (document.hidden) return;
      messageIndex = (messageIndex + 1) % orbitMessages.length;
      const [title, subtitle, color] = orbitMessages[messageIndex];
      orbitCenter.classList.add('is-changing');
      window.setTimeout(() => {
        orbitMessage.innerHTML = title;
        orbitSubtitle.textContent = subtitle;
        orbitCenter.style.setProperty('--orbit-accent', color);
        orbitCenter.classList.remove('is-changing');
      }, 220);
    }, 3600);
  }
}