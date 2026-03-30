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

/* ── Archive content view ───────────────────────────────── */
/* Micro.blog serves /archive/ using the same HTML as the homepage.
   Swap the posts view for the archive list based on the URL. */
(function () {
  'use strict';

  if (!window.location.pathname.startsWith('/archive')) return;

  var postsView   = document.getElementById('nc-posts-view');
  var archiveView = document.getElementById('nc-archive-view');
  if (postsView)   postsView.hidden  = true;
  if (archiveView) archiveView.hidden = false;
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

/* ── Image lightbox ─────────────────────────────────────── */
(function () {
  'use strict';

  var overlay = document.createElement('div');
  overlay.className = 'nc-lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Full-size image');

  var lightboxImg = document.createElement('img');
  lightboxImg.className = 'nc-lightbox__img';
  overlay.appendChild(lightboxImg);
  document.body.appendChild(overlay);

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    overlay.classList.add('nc-lightbox--open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.classList.remove('nc-lightbox--open');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  overlay.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });

  document.querySelectorAll('.post__content img').forEach(function (img) {
    if (img.closest('a')) return; // already a link — skip
    img.addEventListener('click', function () {
      openLightbox(img.src, img.alt);
    });
  });
}());

/* ── Image alt-text caption (raw HTML <img> tags) ──────── */
/* The Hugo render hook handles Markdown images; this covers
   raw HTML images that bypass the render hook. */
(function () {
  'use strict';

  document.querySelectorAll('.post__content img').forEach(function (img) {
    if (img.closest('.nc-image-wrap')) return; // already handled by render hook
    var alt = img.getAttribute('alt');
    if (!alt || !alt.trim()) return;

    var wrap = document.createElement('div');
    wrap.className = 'nc-image-wrap';
    img.parentNode.insertBefore(wrap, img);
    wrap.appendChild(img);

    var caption = document.createElement('span');
    caption.className = 'nc-image-caption';
    caption.setAttribute('aria-hidden', 'true');
    caption.textContent = alt;
    wrap.appendChild(caption);
  });
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
