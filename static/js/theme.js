/* ── Hamburger menu ────────────────────────────────────── */
(function () {
  'use strict';

  var hamburger = document.getElementById('sidebar-hamburger');
  if (!hamburger) return;

  var sidebar  = document.getElementById('site-sidebar');
  var backdrop = document.createElement('div');
  backdrop.className = 'sidebar__backdrop';
  document.body.appendChild(backdrop);

  function openMenu() {
    sidebar.classList.add('sidebar--open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close navigation menu');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    sidebar.classList.remove('sidebar--open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation menu');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    if (sidebar.classList.contains('sidebar--open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  backdrop.addEventListener('click', closeMenu);

  // Close on nav link click (navigating away)
  sidebar.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
}());

/* ── Archive nav active state ──────────────────────────── */
/* Micro.blog renders /archive/ using the home page template, so Hugo
   outputs Posts as is-active. Fix it client-side via the URL. */
(function () {
  'use strict';

  if (!window.location.pathname.startsWith('/archive')) return;

  var nav = document.querySelector('.sidebar__nav');
  if (!nav) return;

  nav.querySelectorAll('a.is-active').forEach(function (a) {
    a.classList.remove('is-active');
  });

  var archiveLink = nav.querySelector('a[href*="/archive/"]');
  if (archiveLink) archiveLink.classList.add('is-active');
}());

/* ── Theme toggle ──────────────────────────────────────── */
(function () {
  'use strict';

  var btn = document.getElementById('theme-toggle');
  if (!btn) return;

  function isLight() {
    return document.documentElement.classList.contains('nc-light');
  }

  function setLight() {
    document.documentElement.classList.add('nc-light');
    document.documentElement.classList.remove('nc-dark');
    localStorage.setItem('nc-theme', 'light');
  }

  function setDark() {
    document.documentElement.classList.remove('nc-light');
    document.documentElement.classList.add('nc-dark');
    localStorage.setItem('nc-theme', 'dark');
  }

  btn.addEventListener('click', function () {
    if (isLight()) {
      setDark();
    } else {
      setLight();
    }
  });
}());
