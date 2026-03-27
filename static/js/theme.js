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
