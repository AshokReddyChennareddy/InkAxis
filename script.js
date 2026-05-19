/* ============================================================
   InkAxis Studio — script.js
   Reviews → Google Sheets only
   ============================================================ */

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzo4AjpiYHdJp1rzvzlpuvjH8IOnX_Ut3EhMveWIqct7iVcPbZr5tYv30FZl60K6XilIw/exec';

/* ── SCROLL TO TOP ON LOAD ── */
if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}
window.scrollTo({ top: 0, behavior: 'instant' });

/* ── 3D TILT EFFECT on service & pricing cards ── */
function init3DTilt() {
  document.querySelectorAll('.service-card, .pricing-card, .process-step, .student-offer-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const tiltX = y * 8;
      const tiltY = x * -8;
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
}

/* ── FLOATING PARTICLE CANVAS ── */
function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particles';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.5;';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const particles = Array.from({ length: 55 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.5 + 0.3,
    dx: (Math.random() - 0.5) * 0.25,
    dy: (Math.random() - 0.5) * 0.25,
    opacity: Math.random() * 0.5 + 0.1
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(74,172,219,${p.opacity * 0.4})`;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(74,172,219,${0.04 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ── GLOW CURSOR TRAIL ── */
function initCursorGlow() {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 180px; height: 180px; border-radius: 50%;
    background: radial-gradient(circle, rgba(74,172,219,0.025) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.08s ease, top 0.08s ease;
    left: -999px; top: -999px;
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

/* ── SCROLL GLOW on section labels ── */
function initScrollGlow() {
  const labels = document.querySelectorAll('.section-label');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.textShadow = '0 0 20px rgba(74,172,219,0.6)';
      }
    });
  }, { threshold: 0.5 });
  labels.forEach(l => io.observe(l));
}

/* ── HERO CINEMATIC ENTRANCE ── */
function initHeroEntrance() {
  const home = document.getElementById('home');
  if (!home) return;

  requestAnimationFrame(() => {
    home.classList.add('hero-animate');
  });

  const tagline = home.querySelector('.hero-tagline');
  if (tagline) {
    const original = tagline.textContent.trim();
    tagline.textContent = '';
    tagline.style.borderRight = '2px solid var(--sky)';
    tagline.style.whiteSpace = 'nowrap';
    tagline.style.overflow = 'hidden';
    let i = 0;
    const type = () => {
      if (i <= original.length) {
        tagline.textContent = original.slice(0, i);
        i++;
        setTimeout(type, 38);
      } else {
        setTimeout(() => { tagline.style.borderRight = 'none'; }, 1200);
      }
    };
    setTimeout(type, 1050);
  }

  function animateCount(el, target, duration) {
    const isDecimal = target % 1 !== 0;
    const start = 0;
    const step = timestamp => {
      if (!step.startTime) step.startTime = timestamp;
      const progress = Math.min((timestamp - step.startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = start + (target - start) * ease;
      el.textContent = (isDecimal ? val.toFixed(1) : Math.floor(val)) + '+';
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  setTimeout(() => {
    document.querySelectorAll('.hero-stat-num').forEach(el => {
      const text = el.textContent.replace('+', '').trim();
      const num = parseFloat(text);
      if (!isNaN(num)) animateCount(el, num, 800);
    });
  }, 2050);
}

/* ── INIT ALL EFFECTS ── */
document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo({ top: 0, behavior: 'instant' });
  initHeroEntrance();
  initParticles();
  init3DTilt();
  initCursorGlow();
  initScrollGlow();
});

/* ── FILE NAME DISPLAY ── */
function showFileName(input) {
  const display = document.getElementById('fileNameDisplay');
  if (input.files && input.files[0]) {
    display.textContent = '✓ ' + input.files[0].name;
    display.style.display = 'block';
  }
}

/* ── FADE ON SCROLL ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

/* ── MOBILE MENU ── */
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });

  // Close menu when any link is tapped
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
    });
  });

  // Close menu when tapping outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
    }
  });
})();

/* ── FAQ ACCORDION ── */
function toggleFaq(btn) {
  const ans = btn.nextElementSibling;
  const isOpen = ans.classList.contains('open');
  document.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-q').forEach(q => q.classList.remove('open'));
  if (!isOpen) { ans.classList.add('open'); btn.classList.add('open'); }
}

/* ── PRICING TABS ── */
const pricingData = {
  ai: [
    { name: 'Basic', price: '₹2,999', desc: 'For small models, quick prototypes, or single-task scripts.', feats: ['1 ML model or analysis script', 'Basic data cleaning & preprocessing', 'Jupyter notebook delivery', '3-day delivery', '1 revision round'], btn: 'plan-btn-dark' },
    { name: 'Standard', price: '₹7,499', desc: 'Full pipeline — data to deployed model with documentation.', feats: ['End-to-end ML pipeline', 'EDA + feature engineering', 'Model evaluation & report', '7-day delivery', '3 revision rounds'], btn: 'plan-btn-sky', featured: true },
    { name: 'Premium', price: '₹14,999', desc: 'Enterprise-grade solution with deployment, API and full support.', feats: ['Custom deep learning model', 'API / deployment ready', 'Full technical documentation', '14-day delivery', 'Unlimited revisions'], btn: 'plan-btn-dark' }
  ],
  research: [
    { name: 'Basic', price: '₹1,999', desc: 'Abstract, intro, and literature review for short papers.', feats: ['Up to 3,000 words', 'Literature review', 'Plagiarism check', '3-day delivery', '1 revision round'], btn: 'plan-btn-dark' },
    { name: 'Standard', price: '₹5,499', desc: 'Full research paper — methodology to conclusion.', feats: ['Full paper up to 8,000 words', 'IEEE/Springer format', 'Turnitin checked', '7-day delivery', '3 revision rounds'], btn: 'plan-btn-sky', featured: true },
    { name: 'Premium', price: '₹9,999', desc: 'Journal-ready manuscript with editing and submission support.', feats: ['Unlimited word count', 'Peer-review ready editing', 'Citation management', '14-day delivery', 'Unlimited revisions'], btn: 'plan-btn-dark' }
  ],
  web: [
    { name: 'Basic', price: '₹1,499', desc: 'Clean single-page resume or simple portfolio.', feats: ['1-page resume or CV', 'ATS-optimized format', 'PDF + Word delivery', '2-day delivery', '1 revision round'], btn: 'plan-btn-dark' },
    { name: 'Standard', price: '₹4,999', desc: 'Multi-page portfolio website with projects and contact.', feats: ['5-page portfolio site', 'Mobile responsive', 'Contact form', '5-day delivery', '3 revision rounds'], btn: 'plan-btn-sky', featured: true },
    { name: 'Premium', price: '₹9,999', desc: 'Full business website with SEO, blog and CMS.', feats: ['Unlimited pages', 'SEO optimized', 'CMS / blog ready', '10-day delivery', 'Unlimited revisions'], btn: 'plan-btn-dark' }
  ]
};

function switchTab(el, key) {
  document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const grid = document.getElementById('pricingGrid');
  grid.innerHTML = pricingData[key].map(p => `
    <div class="pricing-card${p.featured ? ' featured' : ''}">
      ${p.featured ? '<div class="featured-badge">MOST POPULAR</div>' : ''}
      <div class="plan-name">${p.name}</div>
      <div class="price-amount">${p.price}<span>/project</span></div>
      <div class="plan-desc">${p.desc}</div>
      <ul class="feat-list">${p.feats.map(f => `<li class="feat-item">${f}</li>`).join('')}</ul>
      <button class="plan-btn ${p.btn}" onclick="document.getElementById('contact').scrollIntoView({behavior:'smooth'})">Get Started</button>
    </div>`).join('');
}

/* ── REVIEWS — Google Sheets only ── */

/* ── Render reviews into the page ── */
function renderReviews(reviews) {
  const display = document.getElementById('reviewsDisplay');
  const emptyCard = document.getElementById('emptyStateCard');
  const heading = document.getElementById('reviewHeading');
  const subtitle = document.getElementById('reviewSubtitle');

  if (!reviews || reviews.length === 0) {
    display.innerHTML = '';
    emptyCard.style.display = '';
    heading.innerHTML = 'Be Our <em>First Review</em>';
    subtitle.textContent = "We're just getting started — work with us and leave the review that others will read first.";
    return;
  }

  emptyCard.style.display = 'none';
  heading.innerHTML = 'What Clients <em>Say</em>';
  subtitle.textContent = `${reviews.length} real review${reviews.length > 1 ? 's' : ''} from people who trusted InkAxis with their work.`;

  display.innerHTML = `
    <div class="live-reviews-grid">
      ${[...reviews].reverse().map(r => {
    const initials = String(r.name).trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const stars = '★'.repeat(Number(r.stars)) + '☆'.repeat(5 - Number(r.stars));
    const date = r.date ? new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
    return `
          <div class="live-review-card">
            <div class="live-review-stars">${stars}</div>
            <p class="testi-quote">"${r.text}"</p>
            <div class="testi-author">
              <div class="testi-avatar" style="background:var(--sky);color:var(--ink);">${initials}</div>
              <div>
                <div class="testi-name">${r.name}</div>
                <div class="testi-role">${r.role || 'InkAxis Client'}${date ? ' · ' + date : ''}</div>
              </div>
            </div>
          </div>`;
  }).join('')}
    </div>`;
}

/* ── Star picker ── */
function setStars(val) {
  document.getElementById('starValue').value = val;
  document.querySelectorAll('.star-picker span').forEach(s => {
    s.classList.toggle('active', parseInt(s.dataset.val) <= val);
  });
}

/* ── LOAD reviews from Google Sheets ── */
function loadReviews() {
  const callbackName = 'inkaxis_cb_' + Date.now();
  const script = document.createElement('script');
  script.src = APPS_SCRIPT_URL + '?callback=' + callbackName;
  window[callbackName] = function (data) {
    delete window[callbackName];
    document.body.removeChild(script);
    renderReviews(Array.isArray(data) ? data : []);
  };
  script.onerror = () => {
    delete window[callbackName];
    try { document.body.removeChild(script); } catch (e) { }
    renderReviews([]);
  };
  setTimeout(() => {
    if (window[callbackName]) {
      delete window[callbackName];
      try { document.body.removeChild(script); } catch (e) { }
      renderReviews([]);
    }
  }, 6000);
  document.body.appendChild(script);
}

/* ── SUBMIT review to Google Sheets ── */
async function handleReview(e) {
  e.preventDefault();

  const stars = parseInt(document.getElementById('starValue').value);
  if (stars === 0) { alert('Please select a star rating.'); return; }

  const name = document.getElementById('rName').value.trim();
  const role = document.getElementById('rRole').value.trim();
  const text = document.getElementById('rText').value.trim();
  const btn = e.target.querySelector('button[type="submit"]');
  const review = { name, role, stars, text, date: new Date().toISOString() };

  btn.textContent = 'Posting...';
  btn.disabled = true;

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(review)
    });
    await new Promise(r => setTimeout(r, 1500));
    loadReviews();
  } catch (err) {
    btn.textContent = 'Submit Review →';
    btn.disabled = false;
    alert('Could not save review. Please check your connection.');
    return;
  }

  btn.textContent = 'Review Posted! ✓';
  btn.style.background = 'var(--teal)';
  btn.style.borderColor = 'var(--teal)';

  setTimeout(() => {
    btn.textContent = 'Submit Review →';
    btn.style.background = '';
    btn.style.borderColor = '';
    btn.disabled = false;
    document.getElementById('reviewForm').reset();
    document.getElementById('starValue').value = '0';
    document.querySelectorAll('.star-picker span').forEach(s => s.classList.remove('active'));
  }, 2500);
}

/* ── CONTACT FORM ── */
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.form-submit');
  btn.textContent = 'Message Sent! ✓';
  btn.style.background = 'var(--teal)';
  setTimeout(() => { btn.textContent = 'Send Message →'; btn.style.background = ''; e.target.reset(); }, 3000);
}

/* ── ACTIVE NAV ON SCROLL ── */
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) cur = s.id; });
  document.querySelectorAll('nav ul a').forEach(a => {
    if (a.classList.contains('nav-cta') || a.classList.contains('nav-students')) return;
    a.classList.toggle('nav-active', a.getAttribute('href') === '#' + cur);
  });
});
document.getElementById('year').textContent = new Date().getFullYear();
/* ── INIT ── */
loadReviews();
