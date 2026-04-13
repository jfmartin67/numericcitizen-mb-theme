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

/* ── Photos content view ────────────────────────────────── */
/* Micro.blog serves /photos/ using the same HTML as the homepage.
   Swap the posts view for the photos grid based on the URL. */
(function () {
  'use strict';

  if (!window.location.pathname.startsWith('/photos')) return;

  var postsView  = document.getElementById('nc-posts-view');
  var photosView = document.getElementById('nc-photos-view');
  if (postsView)  postsView.hidden  = true;
  if (photosView) photosView.hidden = false;
}());

/* ── Photos nav active state ────────────────────────────── */
(function () {
  'use strict';

  if (!window.location.pathname.startsWith('/photos')) return;

  var sidebar = document.getElementById('site-sidebar');
  if (!sidebar) return;

  // Remove is-active from Posts (set server-side on homepage HTML)
  sidebar.querySelectorAll('.sidebar__nav a.is-active').forEach(function (a) {
    a.classList.remove('is-active');
  });

  // Add is-active to the Photos link wherever it lives (Pages section)
  var photosLink = sidebar.querySelector('a[href*="/photos/"]');
  if (photosLink) photosLink.classList.add('is-active');
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

/* ── Masonry column utilities ───────────────────────────── */
/* Distribute items into column wrappers in round-robin order */
/* so reading left-to-right across columns matches source     */
/* (reverse-chronological) order, not top-to-bottom per col. */
function ncBuildMasonry(grid, colCount) {
  var items = Array.prototype.filter.call(grid.children, function (el) {
    return el.classList.contains('photos-grid__item');
  });
  if (!items.length) return;

  var cols = [];
  for (var i = 0; i < colCount; i++) {
    var col = document.createElement('div');
    col.className = 'masonry-col';
    cols.push(col);
    grid.appendChild(col);
  }
  items.forEach(function (item, idx) {
    cols[idx % colCount].appendChild(item);
  });
}

function ncTeardownMasonry(grid) {
  var cols = Array.prototype.filter.call(grid.children, function (el) {
    return el.classList.contains('masonry-col');
  });
  if (!cols.length) return;

  /* Interleave items from columns to restore original source order */
  var frag = document.createDocumentFragment();
  var maxLen = 0;
  cols.forEach(function (c) { if (c.children.length > maxLen) maxLen = c.children.length; });
  for (var i = 0; i < maxLen; i++) {
    cols.forEach(function (col) {
      if (col.children[0]) frag.appendChild(col.children[0]);
    });
  }
  cols.forEach(function (col) { grid.removeChild(col); });
  grid.appendChild(frag);
}

/* ── Photos grid layout toggle ──────────────────────────── */
/* Handles the theme's own photos view (index.html JS-swap path). */
(function () {
  'use strict';
  var grid = document.getElementById('photos-grid');
  if (!grid) return;

  var btns = document.querySelectorAll('.photos-segmented__btn');
  var KEY  = 'nc-photos-layout';

  function colCount() { return window.innerWidth <= 700 ? 2 : 3; }

  function setLayout(mode) {
    if (mode === 'masonry') {
      if (!grid.classList.contains('photos-grid--masonry')) {
        grid.classList.add('photos-grid--masonry');
        ncBuildMasonry(grid, colCount());
      }
    } else {
      if (grid.classList.contains('photos-grid--masonry')) {
        ncTeardownMasonry(grid);
        grid.classList.remove('photos-grid--masonry');
      }
    }
    btns.forEach(function (btn) {
      var active = btn.getAttribute('data-layout') === mode;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    try { localStorage.setItem(KEY, mode); } catch (e) {}
  }

  /* Rebuild masonry columns on resize to keep correct column count */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (grid.classList.contains('photos-grid--masonry')) {
        ncTeardownMasonry(grid);
        ncBuildMasonry(grid, colCount());
      }
    }, 150);
  });

  /* restore saved preference */
  var saved;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (saved === 'masonry' || saved === 'grid') setLayout(saved);

  btns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLayout(btn.getAttribute('data-layout'));
    });
  });
}());

/* ── Native Micro.blog photos page enhancement ───────────── */
/* When a blog has many photos, Micro.blog serves its own     */
/* photos template (bare <a><img> pairs) instead of routing   */
/* /photos/ to the homepage HTML. Inject the theme's          */
/* photos-page wrapper, header, and Grid/Masonry control.     */
(function () {
  'use strict';

  if (!window.location.pathname.startsWith('/photos')) return;

  /* The index.html JS-swap path already handles this case.   */
  if (document.getElementById('nc-photos-view')) return;

  var main = document.getElementById('main-content');
  if (!main) return;

  /* Collect anchor elements wrapping images (photo tiles).   */
  var anchors = Array.prototype.filter.call(
    main.querySelectorAll('a'),
    function (a) { return !!a.querySelector('img'); }
  );
  if (!anchors.length) return;

  /* Build photos-page wrapper with header + segmented control */
  var page = document.createElement('div');
  page.className = 'photos-page';
  page.innerHTML =
    '<div class="photos-page__header">' +
      '<h1 class="photos-page__title">Photos</h1>' +
      '<div class="photos-segmented" role="group" aria-label="Layout mode">' +
        '<button class="photos-segmented__btn is-active" data-layout="grid" aria-pressed="true">Grid</button>' +
        '<button class="photos-segmented__btn" data-layout="masonry" aria-pressed="false">Masonry</button>' +
      '</div>' +
    '</div>';

  /* Build grid and move existing anchors into it.            */
  var grid = document.createElement('div');
  grid.className = 'photos-grid';
  grid.id = 'photos-grid';
  grid.setAttribute('role', 'list');

  anchors.forEach(function (a) {
    a.classList.add('photos-grid__item');
    a.setAttribute('role', 'listitem');
    a.setAttribute('aria-label', 'View post containing this photo');
    var img = a.querySelector('img');
    if (img) img.classList.add('photos-grid-item');
    grid.appendChild(a);
  });

  page.appendChild(grid);
  main.innerHTML = '';
  main.appendChild(page);

  /* Wire up layout toggle (the earlier IIFE returned early    */
  /* because #photos-grid didn't exist at that point).         */
  var btns = page.querySelectorAll('.photos-segmented__btn');
  var KEY  = 'nc-photos-layout';

  function colCount() { return window.innerWidth <= 700 ? 2 : 3; }

  function setLayout(mode) {
    if (mode === 'masonry') {
      if (!grid.classList.contains('photos-grid--masonry')) {
        grid.classList.add('photos-grid--masonry');
        ncBuildMasonry(grid, colCount());
      }
    } else {
      if (grid.classList.contains('photos-grid--masonry')) {
        ncTeardownMasonry(grid);
        grid.classList.remove('photos-grid--masonry');
      }
    }
    btns.forEach(function (btn) {
      var active = btn.getAttribute('data-layout') === mode;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    try { localStorage.setItem(KEY, mode); } catch (e) {}
  }

  /* Rebuild masonry columns on resize to keep correct column count */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (grid.classList.contains('photos-grid--masonry')) {
        ncTeardownMasonry(grid);
        ncBuildMasonry(grid, colCount());
      }
    }, 150);
  });

  var saved;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (saved === 'masonry' || saved === 'grid') setLayout(saved);

  btns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLayout(btn.getAttribute('data-layout'));
    });
  });
}());
