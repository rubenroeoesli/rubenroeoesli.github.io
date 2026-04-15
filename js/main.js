/* ═══════════════════════════════════════════════════
   RUBEN RÖÖSLI – main.js  |  Interaktive Version
   ═══════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────────── */
/* 1. LOADER                                           */
/* ─────────────────────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  const hide = () => loader.classList.add('hidden');

  if (document.readyState === 'complete') {
    setTimeout(hide, 200);
  } else {
    window.addEventListener('load', () => setTimeout(hide, 300));
    // Fallback – spätestens nach 1.5s weg
    setTimeout(hide, 1500);
  }
})();




/* ─────────────────────────────────────────────────── */
/* 4. NAVIGATION – scrolled state + Hamburger          */
/* ─────────────────────────────────────────────────── */
(function initNav() {
  const nav       = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      navLinks.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(l => l.addEventListener('click', closeMenu));
    document.addEventListener('click', e => {
      if (navLinks.classList.contains('open') && !nav.contains(e.target)) closeMenu();
    });
    function closeMenu() {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  // Active link highlighting
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    const pos = window.scrollY + 130;
    sections.forEach(s => {
      if (pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight) {
        links.forEach(l => l.classList.remove('active'));
        const a = document.querySelector(`.nav-link[href="#${s.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }, { passive: true });
})();


/* ─────────────────────────────────────────────────── */
/* 5. SMOOTH SCROLL                                    */
/* ─────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  });
});


/* ─────────────────────────────────────────────────── */
/* 6. SEKTION-DOTS NAVIGATION                          */
/* ─────────────────────────────────────────────────── */
(function initSectionDots() {
  const nav  = document.getElementById('section-nav');
  const dots = document.querySelectorAll('.sn-dot');
  if (!nav || !dots.length) return;

  // Klick: scrollt zur Sektion
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = document.getElementById(dot.dataset.section);
      if (target) window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 80,
        behavior: 'smooth'
      });
    });
  });

  const sectionIds = ['home', 'leistungen', 'social-media', 'portfolio', 'ueber-mich', 'warum-ich', 'preise', 'kontakt'];

  function update() {
    const pos = window.scrollY + window.innerHeight * 0.35;

    // Dots nach kurzer Zeit einblenden
    if (window.scrollY > 200) nav.classList.add('visible');
    else nav.classList.remove('visible');

    let current = sectionIds[0];
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el && pos >= el.offsetTop) current = id;
    });
    dots.forEach(d => d.classList.toggle('active', d.dataset.section === current));
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();


/* ─────────────────────────────────────────────────── */
/* 7. SCROLL REVEAL (Intersection Observer)            */
/* ─────────────────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
})();


/* ─────────────────────────────────────────────────── */
/* 8. CYCLING HERO TEXT                                */
/* ─────────────────────────────────────────────────── */
(function initHeroCycle() {
  const el   = document.getElementById('hero-cycle');
  const wrap = el?.closest('.cycle-wrap');
  if (!el || !wrap) return;

  const words = ['verkaufen.', 'begeistern.', 'wachsen.', 'überzeugen.'];
  let index = 0;

  // Breite auf das breiteste Wort fixieren → kein Layout-Sprung
  function fixWidth() {
    const tmp = el.cloneNode(true);
    // Computed font vom Original übernehmen
    const cs = window.getComputedStyle(el);
    tmp.style.cssText = `
      position:absolute;visibility:hidden;white-space:nowrap;
      pointer-events:none;
      font:${cs.font};
      letter-spacing:${cs.letterSpacing};
      -webkit-text-fill-color:transparent;
    `;
    wrap.appendChild(tmp); // Im gleichen Kontext messen
    let max = 0;
    words.forEach(w => {
      tmp.textContent = w;
      max = Math.max(max, tmp.getBoundingClientRect().width);
    });
    wrap.removeChild(tmp);
    wrap.style.minWidth = Math.ceil(max) + 'px';
  }
  fixWidth();
  window.addEventListener('resize', fixWidth, { passive: true });

  // Cycling-Interval
  setInterval(() => {
    el.classList.remove('cycle-in');
    el.classList.add('cycle-out');

    setTimeout(() => {
      index = (index + 1) % words.length;
      el.textContent = words[index];
      el.classList.remove('cycle-out');
      el.classList.add('cycle-in');
      setTimeout(() => el.classList.remove('cycle-in'), 550);
    }, 300);
  }, 3200);
})();


/* ─────────────────────────────────────────────────── */
/* 9. CARD SPOTLIGHT (Maus-Tracking Glow)              */
/* ─────────────────────────────────────────────────── */
(function initCardSpotlight() {
  const cards = document.querySelectorAll('.service-card, .why-card, .pricing-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top)  + 'px');
    });
  });
})();


/* ─────────────────────────────────────────────────── */
/* 10. MAGNETISCHE BUTTONS                             */
/* ─────────────────────────────────────────────────── */
(function initMagnetic() {
  const btns = document.querySelectorAll('.btn-primary');

  btns.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.22;
      const y = (e.clientY - r.top  - r.height / 2) * 0.28;
      btn.style.transform = `translate(${x}px, ${y}px) translateY(-2px)`;
      btn.style.transition = 'transform .1s linear, box-shadow .22s';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform   = '';
      btn.style.transition  = 'transform .45s var(--ease), box-shadow .22s';
    });
  });
})();


/* ─────────────────────────────────────────────────── */
/* 11. PORTFOLIO MOCKUP 3D-TILT                        */
/* ─────────────────────────────────────────────────── */
(function initTilt() {
  document.querySelectorAll('.mockup-wrapper').forEach(wrapper => {
    const mockup = wrapper.querySelector('.browser-mockup');
    if (!mockup) return;

    wrapper.addEventListener('mousemove', e => {
      const r = mockup.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      mockup.style.transform =
        `perspective(900px) rotateX(${y * -7}deg) rotateY(${x * 7}deg) scale(1.02)`;
      mockup.style.transition = 'transform .08s linear';
    });

    wrapper.addEventListener('mouseleave', () => {
      mockup.style.transform  = 'perspective(900px) rotateX(0) rotateY(0) scale(1)';
      mockup.style.transition = 'transform .5s var(--ease)';
    });
  });
})();


/* ─────────────────────────────────────────────────── */
/* 12. PARALLAX (Hero Orbs + Maus)                     */
/* ─────────────────────────────────────────────────── */
(function initParallax() {
  const orbs = document.querySelectorAll('.orb');
  const hero = document.querySelector('.hero');
  if (!orbs.length || !hero) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (orbs[0]) orbs[0].style.transform = `translateY(${y * 0.07}px)`;
    if (orbs[1]) orbs[1].style.transform = `translateY(${y * -0.05}px)`;
  }, { passive: true });

  hero.addEventListener('mousemove', e => {
    const r  = hero.getBoundingClientRect();
    const cx = (e.clientX - r.left) / r.width  - 0.5;
    const cy = (e.clientY - r.top)  / r.height - 0.5;
    if (orbs[0]) orbs[0].style.transform = `translate(${cx * 30}px, ${cy * 20}px)`;
    if (orbs[1]) orbs[1].style.transform = `translate(${cx * -24}px, ${cy * -15}px)`;
    if (orbs[2]) orbs[2].style.transform = `translate(${cx * 14}px, ${cy * 10}px)`;
  });
  hero.addEventListener('mouseleave', () => {
    orbs.forEach(o => o.style.transform = '');
  });
})();


/* ─────────────────────────────────────────────────── */
/* 13. COUNTER-ANIMATION                               */
/* ─────────────────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (!counters.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = +el.dataset.count;
      const dur    = 1400;
      const start  = performance.now();

      (function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(e * target);
        if (p < 1) { requestAnimationFrame(tick); }
        else {
          el.textContent = target;
          el.classList.add('counted');
          setTimeout(() => el.classList.remove('counted'), 450);
        }
      })(start);

      io.unobserve(el);
    });
  }, { threshold: 0.6 });

  counters.forEach(c => io.observe(c));
})();


/* ─────────────────────────────────────────────────── */
/* 14. KONTAKTFORMULAR                                 */
/* ─────────────────────────────────────────────────── */
(function initForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', async e => {
    const action = form.getAttribute('action') || '';

    // Fallback mailto wenn Formspree nicht konfiguriert
    if (action.includes('IHRE_FORMSPREE_ID')) {
      e.preventDefault();
      const name    = (document.getElementById('name')?.value    || '').trim();
      const email   = (document.getElementById('email')?.value   || '').trim();
      const subject = (document.getElementById('subject')?.value || 'Projektanfrage').trim();
      const message = (document.getElementById('message')?.value || '').trim();
      const body    = encodeURIComponent(`Name: ${name}\nE-Mail: ${email}\n\n${message}`);
      window.location.href = `mailto:rubenr@gmx.ch?subject=${encodeURIComponent(subject)}&body=${body}`;
      return;
    }

    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.disabled  = true;
    btn.innerHTML = '<span>Wird gesendet…</span>';

    try {
      const res = await fetch(action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      if (res.ok) {
        form.style.display = 'none';
        success?.classList.add('show');
      } else { throw new Error(); }
    } catch {
      btn.disabled  = false;
      btn.innerHTML = '<span>Fehler – bitte erneut versuchen</span>';
    }
  });
})();


/* ─────────────────────────────────────────────────── */
/* 15. FOOTER JAHRESZAHL                               */
/* ─────────────────────────────────────────────────── */
const yr = document.getElementById('year');
if (yr) yr.textContent = new Date().getFullYear();
