// Cursor glow
const cursor = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

// Navbar scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

// Hamburger
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
  navLinks.style.flexDirection = 'column';
  navLinks.style.position = 'absolute';
  navLinks.style.top = '70px';
  navLinks.style.left = '0';
  navLinks.style.right = '0';
  navLinks.style.background = 'rgba(5,7,20,0.98)';
  navLinks.style.padding = '16px 24px';
  navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.08)';
});

// Particle canvas
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.hue = Math.random() > 0.5 ? 270 : 195;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = `hsl(${this.hue}, 80%, 70%)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  // Draw connections
  particles.forEach((p1, i) => {
    particles.slice(i + 1).forEach(p2 => {
      const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      if (dist < 100) {
        ctx.save();
        ctx.globalAlpha = (1 - dist / 100) * 0.15;
        ctx.strokeStyle = '#7c3aed';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.restore();
      }
    });
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// Counter animation
function animateCounter(el) {
  const target = +el.dataset.target;
  let current = 0;
  const increment = target / 50;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) { el.textContent = target; clearInterval(timer); }
    else el.textContent = Math.floor(current);
  }, 30);
}

// Intersection Observer for fade-up and counters
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // counters
      entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.feature-card, .step-content, .pricing-card, .art-item, .hero-stats').forEach(el => {
  el.classList.add('fade-up');
  observer.observe(el);
});

// Typewriter
const text = document.getElementById('typewriterText');
if (text) {
  const full = text.textContent;
  text.textContent = '';
  let i = 0;
  function type() {
    if (i < full.length) {
      text.textContent += full[i++];
      setTimeout(type, 30);
    }
  }
  setTimeout(type, 1000);
}

// Hero stats observer
const heroStats = document.querySelector('.hero-stats');
if (heroStats) observer.observe(heroStats);

// Smooth active nav link on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});
