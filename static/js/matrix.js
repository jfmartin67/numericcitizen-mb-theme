(function () {
  'use strict';

  var CHARS     = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ℕℝℤΔ⊕⊗∇∞≈≠±×÷';
  var COL_WIDTH  = 24;
  var FONT_SIZE  = 14;
  var FRAME_SKIP = 6; // ~10fps (was 4/~15fps, slowed 30%)

  function randChar() {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function isLightMode() {
    var html = document.documentElement;
    if (html.classList.contains('nc-light')) return true;
    if (html.classList.contains('nc-dark'))  return false;
    return window.matchMedia('(prefers-color-scheme: light)').matches;
  }

  // Per-character color based on position in stream.
  // progress: 1.0 at head, 0.0 at tail.
  function charColor(progress) {
    if (progress > 0.95) {
      return 'rgba(224,247,255,0.80)'; // head — near-white
    }
    if (progress > 0.4) {
      var t     = (progress - 0.4) / 0.55;
      var green = Math.round(180 + 75 * t);
      var alpha = (0.28 + 0.48 * t).toFixed(2);
      return 'rgba(0,' + green + ',255,' + alpha + ')'; // bright cyan, fading
    }
    if (progress > 0.25) {
      var t2     = (progress - 0.25) / 0.15;
      var alpha2 = (0.16 + 0.20 * t2).toFixed(2);
      return 'rgba(30,120,220,' + alpha2 + ')'; // mid blue, fading
    }
    return 'rgba(20,60,160,' + (progress * 0.44).toFixed(2) + ')'; // tail — deep blue
  }

  // Darker blue palette for light mode (needs contrast against near-white background).
  function charColorLight(progress) {
    if (progress > 0.95) {
      return 'rgba(0,70,190,0.95)'; // head — strong dark blue
    }
    if (progress > 0.4) {
      var t     = (progress - 0.4) / 0.55;
      var alpha = (0.55 + 0.35 * t).toFixed(2);
      return 'rgba(0,55,170,' + alpha + ')'; // dark blue, fading
    }
    if (progress > 0.25) {
      var t2     = (progress - 0.25) / 0.15;
      var alpha2 = (0.30 + 0.25 * t2).toFixed(2);
      return 'rgba(10,35,130,' + alpha2 + ')'; // mid dark blue
    }
    return 'rgba(5,20,100,' + (progress * 0.55).toFixed(2) + ')'; // tail — deep navy
  }

  // ── Setup ──────────────────────────────────────────────────

  var canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = [
    'position:fixed',
    'top:0',
    'left:0',
    'width:100%',
    'height:100%',
    'z-index:0',
    'pointer-events:none',
  ].join(';');
  document.body.insertBefore(canvas, document.body.firstChild);

  var ctx  = canvas.getContext('2d');
  var cols = [];
  var frameCount = 0;

  function updateOpacity() {
    canvas.style.opacity = isLightMode() ? '0.35' : '0.144';
  }

  function init() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    var numCols = Math.floor(canvas.width / COL_WIDTH);
    var rows    = Math.floor(canvas.height / FONT_SIZE);

    cols = [];
    for (var i = 0; i < numCols; i++) {
      cols.push({
        y:      randInt(-rows, 0),       // staggered start positions
        length: randInt(8, 24),
        speed:  randInt(1, 3),
        gap:    randInt(5, 80),
        active: Math.random() > 0.5,
      });
    }
  }

  // ── Draw loop ──────────────────────────────────────────────

  function draw() {
    var rows = Math.floor(canvas.height / FONT_SIZE);

    // Trail fade — colour matches current background so old characters
    // dissolve naturally in both dark and light mode.
    ctx.fillStyle = isLightMode()
      ? 'rgba(250,250,250,0.10)'
      : 'rgba(15,15,15,0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = FONT_SIZE + 'px monospace';

    for (var i = 0; i < cols.length; i++) {
      var col = cols[i];
      var x   = i * COL_WIDTH;

      if (col.active) {
        for (var j = 0; j < col.length; j++) {
          var row = col.y - j;
          if (row < 0 || row > rows) continue;

          var progress = 1 - j / col.length;
          ctx.fillStyle = isLightMode() ? charColorLight(progress) : charColor(progress);
          ctx.fillText(randChar(), x, row * FONT_SIZE);
        }

        col.y += col.speed;

        // Stream fully off-screen → reset to idle
        if (col.y - col.length > rows) {
          col.active = false;
          col.gap    = randInt(10, 80);
        }
      } else {
        col.gap--;
        if (col.gap <= 0) {
          col.active = true;
          col.y      = -randInt(0, 8);
          col.length = randInt(8, 24);
          col.speed  = randInt(1, 3);
        }
      }
    }
  }

  function loop() {
    frameCount++;
    if (frameCount % FRAME_SKIP === 0) draw();
    requestAnimationFrame(loop);
  }

  updateOpacity();
  init();
  loop();

  window.addEventListener('resize', function () {
    init();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  // React to theme toggle (class change on <html>)
  var observer = new MutationObserver(updateOpacity);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

}());
