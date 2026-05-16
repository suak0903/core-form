/* core:form — Consent-Management für reCAPTCHA und Eversports */
(function () {
  'use strict';

  var KEY = 'cf_consent';
  var RECAPTCHA_SRC = 'https://www.google.com/recaptcha/api.js?render=6LdzUv4rAAAAALCbTO8PTcUkjt89G1DhYE3RIF8l';

  function getConsent()  { return localStorage.getItem(KEY); }
  function saveConsent(v) { localStorage.setItem(KEY, v); }

  function loadRecaptcha() {
    if (window.grecaptcha || document.querySelector('script[src*="recaptcha/api.js"]')) return;
    var s = document.createElement('script');
    s.src = RECAPTCHA_SRC;
    s.async = true;
    document.head.appendChild(s);
    // Badge is injected asynchronously — remove from tab order but keep pointer-interactive
    var mo = new MutationObserver(function () {
      var badge = document.querySelector('.grecaptcha-badge');
      if (badge) {
        badge.setAttribute('tabindex', '-1');
        badge.querySelectorAll('a, button').forEach(function(el) { el.setAttribute('tabindex', '-1'); });
        mo.disconnect();
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  function grantConsent() {
    loadRecaptcha();
    document.dispatchEvent(new CustomEvent('cf:consent'));
  }

  function createBanner() {
    var el = document.createElement('div');
    el.id = 'cookie-banner';
    el.className = 'cookie-banner';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Cookie-Einstellungen');
    el.setAttribute('aria-hidden', 'true');
    el.setAttribute('inert', '');
    el.innerHTML =
      '<div class="cookie-banner__inner">' +
        '<div class="cookie-banner__text">' +
          '<strong class="cookie-banner__title">Externe Dienste</strong>' +
          '<p>Diese Seite nutzt <b>reCAPTCHA</b> (Google) für das Kontaktformular und <b>Eversports</b> für Online-Buchungen.' +
          ' Beide Dienste können Daten an Dritte übermitteln.' +
          ' <a href="datenschutz.html">Datenschutzhinweise</a></p>' +
        '</div>' +
        '<div class="cookie-banner__actions">' +
          '<button id="cookie-accept" class="btn btn--accent">Akzeptieren</button>' +
          '<button id="cookie-decline" class="btn btn--outline">Ablehnen</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(el);

    el.querySelector('#cookie-accept').addEventListener('click', function () {
      saveConsent('accepted');
      hideBanner();
      grantConsent();
    });
    el.querySelector('#cookie-decline').addEventListener('click', function () {
      saveConsent('declined');
      hideBanner();
    });
  }

  function showBanner() {
    var b = document.getElementById('cookie-banner');
    if (!b) return;
    b.removeAttribute('inert');
    b.classList.add('is-visible');
    b.setAttribute('aria-hidden', 'false');
  }

  function hideBanner() {
    var b = document.getElementById('cookie-banner');
    if (!b) return;
    b.classList.remove('is-visible');
    b.setAttribute('aria-hidden', 'true');
    b.setAttribute('inert', '');
  }

  window.cfConsent = { get: getConsent, show: showBanner };

  document.addEventListener('DOMContentLoaded', function () {
    createBanner();

    document.querySelectorAll('[data-privacy-trigger]').forEach(function (el) {
      el.addEventListener('click', function (e) { e.preventDefault(); showBanner(); });
    });

    var consent = getConsent();
    if (consent === 'accepted') {
      grantConsent();
    } else if (!consent) {
      setTimeout(showBanner, 700);
    }
  });
})();
