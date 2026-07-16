/* =========================================================
   JIBIN EARNEST — PORTFOLIO SCRIPT
   Vanilla JS. GSAP + ScrollTrigger, Lenis, AOS, Typed.js,
   VanillaTilt loaded via CDN in index.html.
   ========================================================= */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ---------------------------------------------------
     1. LOADING SCREEN
  --------------------------------------------------- */
  function initLoader() {
    const loader = document.getElementById('loader');
    const needle = document.querySelector('.loader-needle');
    const percentEl = document.getElementById('loaderPercent');
    if (!loader) return;

    const circumference = 2 * Math.PI * 52;
    if (needle) needle.style.strokeDasharray = circumference;

    let progress = 0;
    const finish = () => {
      loader.classList.add('loaded');
      document.body.style.overflow = '';
      startPageAnimations();
    };

    const tick = () => {
      progress += Math.random() * 18 + 6;
      if (progress >= 100) progress = 100;
      if (needle) needle.style.strokeDashoffset = circumference - (circumference * progress) / 100;
      if (percentEl) percentEl.textContent = Math.floor(progress) + '%';
      if (progress < 100) {
        setTimeout(tick, 120);
      } else {
        setTimeout(finish, 350);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('load', () => setTimeout(tick, 200));
    // Fallback in case 'load' already fired
    if (document.readyState === 'complete') setTimeout(tick, 200);
  }

  /* ---------------------------------------------------
     2. CUSTOM CURSOR
  --------------------------------------------------- */
  function initCursor() {
    if (isTouch) return;
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const interactive = document.querySelectorAll('a, button, .tilt-card, input, textarea');
    interactive.forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('active'));
      el.addEventListener('mouseleave', () => ring.classList.remove('active'));
    });
  }

  /* ---------------------------------------------------
     3. SCROLL PROGRESS BAR
  --------------------------------------------------- */
  function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    function update() {
      const h = document.documentElement;
      const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
      bar.style.width = scrolled + '%';
    }
    document.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---------------------------------------------------
     4. PARTICLE CANVAS BACKGROUND
  --------------------------------------------------- */
  function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas || prefersReducedMotion) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const count = Math.min(70, Math.floor((window.innerWidth * window.innerHeight) / 22000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.6,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        a: Math.random() * 0.5 + 0.15
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#38bdf8';
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.globalAlpha = p.a;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Connect nearby particles (loop-line motif)
      ctx.globalAlpha = 0.08;
      ctx.strokeStyle = '#2563eb';
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ---------------------------------------------------
     5. MOUSE GLOW
  --------------------------------------------------- */
  function initMouseGlow() {
    if (isTouch) return;
    const glow = document.getElementById('mouseGlow');
    if (!glow) return;
    window.addEventListener('mousemove', (e) => {
      glow.style.opacity = '1';
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
    window.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  }

  /* ---------------------------------------------------
     6. NAVBAR + MOBILE MENU
  --------------------------------------------------- */
  function initNav() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main section[id]');

    function onScroll() {
      if (window.scrollY > 40) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');

      let current = '';
      sections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= 140 && rect.bottom >= 140) current = sec.id;
      });
      navLinks.forEach((l) => {
        l.classList.toggle('active', l.getAttribute('href') === '#' + current);
      });
    }
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        const isActive = mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('active', isActive);
        hamburger.setAttribute('aria-expanded', String(isActive));
        mobileMenu.setAttribute('aria-hidden', String(!isActive));
        document.body.style.overflow = isActive ? 'hidden' : '';
      });
      mobileMenu.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', () => {
          mobileMenu.classList.remove('active');
          hamburger.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
    }
  }

  /* ---------------------------------------------------
     7. THEME TOGGLE (persisted)
  --------------------------------------------------- */
  function initTheme() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    const stored = localStorage.getItem('je-theme');
    if (stored) {
      document.documentElement.setAttribute('data-theme', stored);
      toggle.setAttribute('aria-pressed', String(stored === 'light'));
    }
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      if (next === 'dark') document.documentElement.removeAttribute('data-theme');
      else document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('je-theme', next);
      toggle.setAttribute('aria-pressed', String(next === 'light'));
    });
  }

  /* ---------------------------------------------------
     8. SMOOTH SCROLL (Lenis) + anchor links
  --------------------------------------------------- */
  let lenisInstance = null;
  function initSmoothScroll() {
    if (prefersReducedMotion || typeof Lenis === 'undefined') return;
    lenisInstance = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });
    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (window.gsap && window.ScrollTrigger) {
      lenisInstance.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => { lenisInstance.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
  }

  function initAnchorLinks() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        if (id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        if (lenisInstance) {
          lenisInstance.scrollTo(target, { offset: -70 });
        } else {
          target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ---------------------------------------------------
     9. TYPED.JS ROLE ROTATOR
  --------------------------------------------------- */
  function initTyped() {
    const el = document.getElementById('typedRole');
    if (!el) return;
    if (typeof Typed === 'undefined' || prefersReducedMotion) {
      el.textContent = 'Instrument Technician';
      return;
    }
    new Typed('#typedRole', {
      strings: [
        'Instrument Technician',
        'Calibration Specialist',
        'Loop Checking Expert',
        'HART &amp; Foundation Fieldbus',
        'Industrial Automation Pro'
      ],
      typeSpeed: 55,
      backSpeed: 30,
      backDelay: 1600,
      startDelay: 300,
      loop: true,
      smartBackspace: true
    });
  }

  /* ---------------------------------------------------
     10. VANILLA TILT (3D hover cards)
  --------------------------------------------------- */
  function initTilt() {
    if (isTouch || typeof VanillaTilt === 'undefined' || prefersReducedMotion) return;
    const cards = document.querySelectorAll('.tilt-card');
    VanillaTilt.init(cards, {
      max: 8,
      speed: 400,
      glare: true,
      'max-glare': 0.12,
      scale: 1.02
    });
  }

  /* ---------------------------------------------------
     11. MAGNETIC BUTTONS
  --------------------------------------------------- */
  function initMagnetic() {
    if (isTouch || prefersReducedMotion) return;
    const items = document.querySelectorAll('.magnetic');
    items.forEach((item) => {
      item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        item.style.transform = `translate(${x * 0.22}px, ${y * 0.3}px)`;
      });
      item.addEventListener('mouseleave', () => {
        item.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* ---------------------------------------------------
     12. ANIMATED COUNTERS (about stats)
  --------------------------------------------------- */
  function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    const animate = (el) => {
      const target = parseInt(el.getAttribute('data-count'), 10) || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1600;
      const start = performance.now();
      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach((c) => observer.observe(c));
  }

  /* ---------------------------------------------------
     13. SKILL BAR PROGRESS ON SCROLL
  --------------------------------------------------- */
  function initSkillBars() {
    const bars = document.querySelectorAll('.skill-bar-fill');
    if (!bars.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const width = entry.target.getAttribute('data-width');
          entry.target.style.width = width + '%';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    bars.forEach((b) => observer.observe(b));
  }

  /* ---------------------------------------------------
     14. GSAP SCROLLTRIGGER SECTION REVEALS
  --------------------------------------------------- */
  function initScrollReveal() {
    if (typeof gsap === 'undefined' || prefersReducedMotion) return;
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.glass-card').forEach((card) => {
      gsap.fromTo(card, { y: 24, opacity: 0.001 }, {
        y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 92%', toggleActions: 'play none none none' }
      });
    });

    gsap.utils.toArray('.section-title, .section-tag, .section-sub').forEach((el) => {
      gsap.fromTo(el, { y: 20, opacity: 0.001 }, {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%' }
      });
    });

    // Parallax blobs
    gsap.to('.bg-blob-1', { y: 120, scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 1 } });
    gsap.to('.bg-blob-2', { y: -100, scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 1 } });
  }

  /* ---------------------------------------------------
     15. PROJECT MODAL
  --------------------------------------------------- */
  function initProjectModal() {
    const modal = document.getElementById('projectModal');
    const backdrop = document.getElementById('modalBackdrop');
    const closeBtn = document.getElementById('modalClose');
    const cards = document.querySelectorAll('.project-card');
    if (!modal) return;

    const titleEl = document.getElementById('modalTitle');
    const metaEl = document.getElementById('modalMeta');
    const descEl = document.getElementById('modalDesc');
    const tagEl = document.getElementById('modalTag');

    function openModal(card) {
      titleEl.textContent = card.getAttribute('data-title');
      metaEl.textContent = card.getAttribute('data-meta');
      descEl.textContent = card.getAttribute('data-desc');
      tagEl.textContent = card.querySelector('.project-tag')?.textContent || 'Site';
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function closeModal() {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    cards.forEach((card) => {
      card.addEventListener('click', () => openModal(card));
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card); }
      });
    });
    backdrop?.addEventListener('click', closeModal);
    closeBtn?.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
  }

  /* ---------------------------------------------------
     16. CONTACT FORM VALIDATION (client-side demo)
  --------------------------------------------------- */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    const status = document.getElementById('formStatus');

    const fields = {
      name: { el: document.getElementById('cf-name'), err: document.getElementById('err-name') },
      email: { el: document.getElementById('cf-email'), err: document.getElementById('err-email') },
      subject: { el: document.getElementById('cf-subject'), err: document.getElementById('err-subject') },
      message: { el: document.getElementById('cf-message'), err: document.getElementById('err-message') }
    };

    function validate() {
      let valid = true;
      Object.entries(fields).forEach(([key, f]) => {
        const value = f.el.value.trim();
        f.el.closest('.form-group').classList.remove('invalid');
        f.err.textContent = '';
        if (!value) {
          f.el.closest('.form-group').classList.add('invalid');
          f.err.textContent = 'This field is required.';
          valid = false;
        } else if (key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          f.el.closest('.form-group').classList.add('invalid');
          f.err.textContent = 'Enter a valid email address.';
          valid = false;
        }
      });
      return valid;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validate()) {
        status.textContent = 'Please fix the highlighted fields.';
        status.style.color = '#f87171';
        return;
      }
      const name = fields.name.el.value.trim();
      const subject = fields.subject.el.value.trim();
      const message = fields.message.el.value.trim();
      const email = fields.email.el.value.trim();

      // No backend attached — open a pre-filled mail draft as a working fallback.
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      const mailto = `mailto:jibine53@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
      window.location.href = mailto;

      status.style.color = 'var(--accent)';
      status.textContent = 'Opening your email app to send this message…';
      form.reset();
    });

    Object.values(fields).forEach((f) => {
      f.el.addEventListener('input', () => {
        f.el.closest('.form-group').classList.remove('invalid');
        f.err.textContent = '';
      });
    });
  }

  /* ---------------------------------------------------
     17. BACK TO TOP
  --------------------------------------------------- */
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (lenisInstance) lenisInstance.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------------------------------------------------
     18. MISC (year, AOS init)
  --------------------------------------------------- */
  function initMisc() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 60,
        disable: prefersReducedMotion
      });
    }
  }

  /* ---------------------------------------------------
     STARTUP SEQUENCE
  --------------------------------------------------- */
  function startPageAnimations() {
    initTyped();
    initTilt();
    initScrollReveal();
    if (window.ScrollTrigger) setTimeout(() => ScrollTrigger.refresh(), 300);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCursor();
    initScrollProgress();
    initParticles();
    initMouseGlow();
    initNav();
    initTheme();
    initSmoothScroll();
    initAnchorLinks();
    initMagnetic();
    initCounters();
    initSkillBars();
    initProjectModal();
    initContactForm();
    initBackToTop();
    initMisc();
  });
})();
