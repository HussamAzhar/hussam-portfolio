/* ==========================================================================
   HUSSAM AZHAR — PORTFOLIO
   Vanilla JS. No frameworks, no build step.
   ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------
     THEME (dark / light) — remembers preference, animates the swap
  --------------------------------------------------------------------- */
  var sunPath = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/>';
  var moonPath = '<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>';
  var themeIcon = document.getElementById('themeIcon');
  var themeBtn = document.getElementById('themeBtn');

  function applyTheme(t) {
    root.style.transition = 'background .5s ease, color .5s ease';
    root.setAttribute('data-theme', t);
    if (themeIcon) themeIcon.innerHTML = (t === 'dark') ? moonPath : sunPath;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'dark' ? '#05070C' : '#F3F5FA');
  }

  var savedTheme;
  try { savedTheme = localStorage.getItem('ha-theme'); } catch (e) {}
  if (!savedTheme) {
    savedTheme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';
  }
  applyTheme(savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('ha-theme', next); } catch (e) {}
    });
  }

  /* ---------------------------------------------------------------------
     MOBILE DRAWER
  --------------------------------------------------------------------- */
  var drawer = document.getElementById('mobileDrawer');
  var menuBtn = document.getElementById('menuBtn');
  var drawerClose = document.getElementById('drawerClose');
  function openDrawer() { drawer.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeDrawer() { drawer.classList.remove('open'); document.body.style.overflow = ''; }
  if (menuBtn) menuBtn.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawer) {
    drawer.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeDrawer); });
    drawer.querySelector('.scrim').addEventListener('click', closeDrawer);
  }

  /* ---------------------------------------------------------------------
     NAV: hide on scroll down / show on scroll up, glass intensifies,
     active-section pill follows the current section
  --------------------------------------------------------------------- */
  var navEl = document.getElementById('siteNav');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  var navPill = document.getElementById('navPill');
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var lastY = window.scrollY;

  function positionPill(link) {
    if (!link || !navPill) { if (navPill) navPill.style.opacity = 0; return; }
    var linkRect = link.getBoundingClientRect();
    var parentRect = link.parentElement.getBoundingClientRect();
    navPill.style.width = linkRect.width + 'px';
    navPill.style.transform = 'translate(' + (linkRect.left - parentRect.left) + 'px,-50%)';
    navPill.style.opacity = 1;
  }

  function onScroll() {
    var y = window.scrollY;
    navEl.classList.toggle('scrolled', y > 30);
    if (y > 160 && y > lastY) {
      navEl.classList.add('hide');
    } else {
      navEl.classList.remove('hide');
    }
    lastY = y;

    var mid = y + window.innerHeight * 0.32;
    var current = '';
    sections.forEach(function (s) { if (s.offsetTop <= mid) current = s.id; });
    var activeLink = null;
    navLinks.forEach(function (l) {
      var isActive = l.getAttribute('href') === '#' + current;
      l.classList.toggle('active', isActive);
      if (isActive) activeLink = l;
    });
    positionPill(activeLink);

    updateBackToTop(y);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------------------------------------------------------------------
     SMOOTH-SCROLL for in-page links (also closes mobile drawer)
  --------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        var y = target.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    });
  });

  /* ---------------------------------------------------------------------
     BACK TO TOP
  --------------------------------------------------------------------- */
  var backToTop = document.getElementById('backToTop');
  function updateBackToTop(y) {
    if (!backToTop) return;
    backToTop.style.opacity = y > 600 ? 1 : 0;
    backToTop.style.pointerEvents = y > 600 ? 'auto' : 'none';
  }

  /* ---------------------------------------------------------------------
     HERO TYPING EFFECT
     Cycles through the categories of things Hussam actually builds.
  --------------------------------------------------------------------- */
  var typedEl = document.getElementById('typedText');
  var phrases = [
    'scalable web apps.',
    'hybrid desktop software.',
    'RESTful APIs.',
    'licensing & DRM systems.',
    'cross-platform CAD tools.'
  ];
  if (typedEl) {
    if (reduceMotion) {
      typedEl.textContent = phrases[0];
    } else {
      var pIndex = 0, cIndex = 0, deleting = false;
      function tick() {
        var full = phrases[pIndex];
        if (!deleting) {
          cIndex++;
          typedEl.textContent = full.slice(0, cIndex);
          if (cIndex === full.length) {
            deleting = true;
            setTimeout(tick, 1500);
            return;
          }
        } else {
          cIndex--;
          typedEl.textContent = full.slice(0, cIndex);
          if (cIndex === 0) {
            deleting = false;
            pIndex = (pIndex + 1) % phrases.length;
          }
        }
        setTimeout(tick, deleting ? 34 : 58);
      }
      setTimeout(tick, 900);
    }
  }

  /* ---------------------------------------------------------------------
     PORTRAIT REGISTRATION MARKS + FLOATING BADGES ignition
  --------------------------------------------------------------------- */
  setTimeout(function () {
    var pf = document.getElementById('portraitFrame');
    var pw = document.getElementById('portraitWrap');
    if (pf) pf.classList.add('lit');
    if (pw) pw.classList.add('lit');
  }, 260);

  /* ---------------------------------------------------------------------
     SCROLL REVEAL
  --------------------------------------------------------------------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  /* ---------------------------------------------------------------------
     COUNT-UP STATS
  --------------------------------------------------------------------- */
  function countUp(el, target, suffix) {
    if (reduceMotion) { el.textContent = target + suffix; return; }
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / 1200, 1);
      el.textContent = Math.round(p * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var statIo = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      countUp(el, target, suffix);
      statIo.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(function (el) { statIo.observe(el); });

  /* ---------------------------------------------------------------------
     SKILL GAUGES
  --------------------------------------------------------------------- */
  var skillIo = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var row = en.target;
      var val = parseInt(row.getAttribute('data-v'), 10);
      row.querySelector('.fill').style.width = val + '%';
      var pc = row.querySelector('.pc');
      if (reduceMotion) { pc.textContent = val + '%'; }
      else { countUp(pc, val, '%'); }
      skillIo.unobserve(row);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.skill-row').forEach(function (s) { skillIo.observe(s); });

  /* ---------------------------------------------------------------------
     TOOLS & TECH MARQUEE — two rows of icon pills, scrolling in opposite
     directions on an infinite CSS loop. Lists are duplicated once so the
     loop at translateX(-50%) is seamless.
  --------------------------------------------------------------------- */
  var CLAUDE_MARK =
    '<svg viewBox="0 0 24 24" fill="currentColor">' +
    [0, 45, 90, 135, 180, 225, 270, 315].map(function (deg) {
      return '<rect x="10.9" y="1.4" width="2.2" height="7.2" rx="1.1" transform="rotate(' + deg + ' 12 12)"/>';
    }).join('') +
    '</svg>';

  var TOOLS_ROW_1 = [
    { l: 'React.js', i: 'fa-brands fa-react', c: '#61DAFB' },
    { l: 'Next.js', i: 'fa-solid fa-n', c: '#9B6BFF' },
    { l: 'Vue.js', i: 'fa-brands fa-vuejs', c: '#42B883' },
    { l: 'TypeScript', i: 'fa-solid fa-t', c: '#3178C6' },
    { l: 'JavaScript', i: 'fa-brands fa-js', c: '#F0DB4F' },
    { l: 'Node.js', i: 'fa-brands fa-node-js', c: '#68A063' },
    { l: 'Express.js', i: 'fa-solid fa-route', c: '#5B8CFF' },
    { l: 'PHP', i: 'fa-brands fa-php', c: '#8892BF' },
    { l: 'Laravel', i: 'fa-brands fa-laravel', c: '#FF2D20' },
    { l: 'Python', i: 'fa-brands fa-python', c: '#FFD43B' },
    { l: 'C++', i: 'fa-solid fa-c', c: '#9B6BFF' },
    { l: 'C# / .NET', i: 'fa-brands fa-microsoft', c: '#7C5CFC' },
    { l: 'HTML5', i: 'fa-brands fa-html5', c: '#E34F26' },
    { l: 'CSS3', i: 'fa-brands fa-css3-alt', c: '#2E9FD6' },
    { l: 'Bootstrap', i: 'fa-brands fa-bootstrap', c: '#9B7BFF' },
    { l: 'jQuery', i: 'fa-solid fa-code', c: '#2E9FD6' },
    { l: 'Material UI', i: 'fa-solid fa-palette', c: '#3EE6C4' },
    { l: 'Redux', i: 'fa-solid fa-diagram-project', c: '#9B6BFF' },
    { l: 'Electron.js', i: 'fa-solid fa-bolt', c: '#FFB454' },
    { l: 'Swift', i: 'fa-brands fa-swift', c: '#FF6B6B' },
    { l: 'Claude', svg: CLAUDE_MARK, c: '#D97757', claude: true }
  ];

  var TOOLS_ROW_2 = [
    { l: 'MySQL', i: 'fa-solid fa-database', c: '#5B8CFF' },
    { l: 'MS SQL Server', i: 'fa-solid fa-database', c: '#FF6B6B' },
    { l: 'MongoDB', i: 'fa-solid fa-leaf', c: '#3EE6C4' },
    { l: 'SQLite', i: 'fa-solid fa-database', c: '#5B8CFF' },
    { l: 'Firebase', i: 'fa-solid fa-fire', c: '#FFB454' },
    { l: 'Google Cloud', i: 'fa-brands fa-google', c: '#5B8CFF' },
    { l: 'BigQuery', i: 'fa-solid fa-chart-column', c: '#5B8CFF' },
    { l: 'Pub/Sub', i: 'fa-solid fa-tower-broadcast', c: '#3EE6C4' },
    { l: 'Docker', i: 'fa-brands fa-docker', c: '#5B8CFF' },
    { l: 'Nginx', i: 'fa-solid fa-server', c: '#3EE6C4' },
    { l: 'GitHub Actions', i: 'fa-brands fa-github', c: '#9B6BFF' },
    { l: 'MS Azure', i: 'fa-brands fa-microsoft', c: '#5B8CFF' },
    { l: 'Git', i: 'fa-brands fa-git-alt', c: '#FF6B6B' },
    { l: 'SmartGit', i: 'fa-solid fa-code-branch', c: '#FF6B6B' },
    { l: 'Visual Studio', i: 'fa-brands fa-microsoft', c: '#9B6BFF' },
    { l: 'VS Code', i: 'fa-solid fa-code', c: '#5B8CFF' },
    { l: 'Azure DevOps / TFS', i: 'fa-brands fa-microsoft', c: '#5B8CFF' },
    { l: 'JIRA', i: 'fa-brands fa-jira', c: '#5B8CFF' },
    { l: 'Postman', i: 'fa-solid fa-paper-plane', c: '#FFB454' },
    { l: 'Figma', i: 'fa-brands fa-figma', c: '#FF6B6B' },
    { l: 'Fiddler', i: 'fa-solid fa-network-wired', c: '#9B6BFF' },
    { l: 'WinSCP', i: 'fa-solid fa-folder-tree', c: '#5B8CFF' },
    { l: 'XAMPP', i: 'fa-solid fa-layer-group', c: '#FFB454' },
    { l: 'Unity WebGL', i: 'fa-solid fa-cube', c: '#FFB454' },
    { l: 'Mac App Store', i: 'fa-brands fa-app-store-ios', c: '#5B8CFF' },
    { l: 'XCode', i: 'fa-brands fa-apple', c: '#9B6BFF' },
    { l: 'MS Office', i: 'fa-solid fa-briefcase', c: '#FF6B6B' }
  ];

  function pillHTML(item) {
    var icon = item.svg ? item.svg : '<i class="' + item.i + '" aria-hidden="true"></i>';
    return '<span class="tool-pill' + (item.claude ? ' is-claude' : '') + '" style="--c:' + item.c + '">' +
      '<span class="pi">' + icon + '</span><span>' + item.l + '</span></span>';
  }
  function renderMarquee(id, list) {
    var track = document.getElementById(id);
    if (!track) return;
    var html = list.map(pillHTML).join('');
    track.innerHTML = html + html; // duplicated once → seamless loop at -50%
  }
  renderMarquee('marqueeTrack1', TOOLS_ROW_1);
  renderMarquee('marqueeTrack2', TOOLS_ROW_2);

  /* ---------------------------------------------------------------------
     PROJECT FLIP CARDS
     Desktop: CSS :hover / :focus-within handles the flip.
     Touch:   tap the card to flip; tap again (or an outside card) to flip back.
     Keyboard: Enter / Space toggles the flip.
  --------------------------------------------------------------------- */
  var isTouch = window.matchMedia && window.matchMedia('(hover: none)').matches;
  var projCards = document.querySelectorAll('.proj-card');

  projCards.forEach(function (card) {
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
  });

  if (isTouch) {
    projCards.forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('a')) return; // let action links work
        projCards.forEach(function (c) { if (c !== card) c.classList.remove('flipped'); });
        card.classList.toggle('flipped');
      });
    });
  }

  /* ---------------------------------------------------------------------
     CURSOR-FOLLOW GLOW (crosshair reticle) — desktop only
  --------------------------------------------------------------------- */
  var glow = document.getElementById('cursorGlow');
  if (glow && !isTouch) {
    var raf = null;
    window.addEventListener('mousemove', function (e) {
      glow.classList.add('active');
      if (raf) return;
      raf = requestAnimationFrame(function () {
        document.documentElement.style.setProperty('--mx', e.clientX + 'px');
        document.documentElement.style.setProperty('--my', e.clientY + 'px');
        raf = null;
      });
    });
    document.addEventListener('mouseleave', function () { glow.classList.remove('active'); });
  }

  /* ---------------------------------------------------------------------
     AMBIENT PARTICLE CANVAS
  --------------------------------------------------------------------- */
  var canvas = document.getElementById('particleCanvas');
  if (canvas && !reduceMotion) {
    var ctx = canvas.getContext('2d');
    var particles = [];
    var W, H;
    var COUNT = window.innerWidth < 720 ? 34 : 64;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    function makeParticles() {
      particles = [];
      for (var i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.4 + 0.4,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          o: Math.random() * 0.5 + 0.15
        });
      }
    }
    resize();
    makeParticles();
    window.addEventListener('resize', function () { resize(); makeParticles(); });

    function draw() {
      ctx.clearRect(0, 0, W, H);
      var isLight = root.getAttribute('data-theme') === 'light';
      var rgb = isLight ? '46,58,90' : '145,170,255';
      particles.forEach(function (p) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(' + rgb + ',' + p.o + ')';
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  /* ---------------------------------------------------------------------
     CONTACT FORM — validates, then opens a pre-filled mail client
  --------------------------------------------------------------------- */
  var form = document.getElementById('contactForm');
  function setInvalid(id, bad) { document.getElementById(id).classList.toggle('invalid', bad); }
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var subject = form.subject.value.trim();
      var msg = form.message.value.trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      var ok = true;
      if (!name) { setInvalid('f-name', true); ok = false; } else setInvalid('f-name', false);
      if (!emailOk) { setInvalid('f-email', true); ok = false; } else setInvalid('f-email', false);
      if (!subject) { setInvalid('f-subject', true); ok = false; } else setInvalid('f-subject', false);
      if (!msg) { setInvalid('f-msg', true); ok = false; } else setInvalid('f-msg', false);
      if (!ok) return;

      var body = 'Name: ' + name + '\nEmail: ' + email + '\n\n' + msg;
      window.location.href = 'mailto:hussam.ravian16@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

      var toast = document.getElementById('toast');
      toast.classList.add('show');
      setTimeout(function () { toast.classList.remove('show'); }, 4200);
      form.reset();
    });
  }

  /* ---------------------------------------------------------------------
     WHATSAPP — Click-to-Chat API (wa.me) integration
     One source of truth for the number + default message; every WhatsApp
     entry point (contact card, contact socials, footer, sticky button)
     is wired here, and the contact form can hand its fields to WhatsApp.
  --------------------------------------------------------------------- */
  var WA = {
    number: '923218803990', // international format — no +, spaces or dashes
    base: 'https://wa.me/',
    greeting: 'Hi Hussam, I found your portfolio and would like to connect about an opportunity.'
  };
  function waLink(text) {
    var msg = (text && text.trim()) ? text.trim() : WA.greeting;
    return WA.base + WA.number + '?text=' + encodeURIComponent(msg);
  }
  Array.prototype.forEach.call(document.querySelectorAll('a[data-wa]'), function (a) {
    a.setAttribute('href', waLink());
  });
  var waSend = document.getElementById('waSend');
  if (waSend && form) {
    waSend.addEventListener('click', function () {
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var subject = form.subject.value.trim();
      var msg = form.message.value.trim();
      var lines = [name ? ('Hi Hussam, this is ' + name + '.') : 'Hi Hussam,'];
      if (subject) lines.push('Re: ' + subject);
      if (msg) lines.push('', msg);
      if (email) lines.push('', 'You can also reach me at ' + email + '.');
      window.open(waLink(lines.join('\n')), '_blank', 'noopener');
    });
  }

  /* ---------------------------------------------------------------------
     FOOTER YEAR
  --------------------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
