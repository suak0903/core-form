/* core:form — shared chrome behavior for subpages
   Handles: scroll-driven nav state, mobile menu, newsletter popup. */

(function () {
  // If this page itself contains the target section, scroll it into view
  // after the layout settles (handles cross-page anchor links like
  // index.html#angebote that don't always land correctly).
  if (window.location.hash) {
    const targetId = window.location.hash.slice(1);
    const scrollToHash = () => {
      const el = document.getElementById(targetId);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 68;
        window.scrollTo({ top, behavior: 'auto' });
      }
    };
    window.addEventListener('load', () => requestAnimationFrame(scrollToHash));
  }

  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');
  const logoImg = document.querySelector('.nav__logo img');
  const newsTriggers = document.querySelectorAll('[data-newsletter-trigger]');
  const popup = document.querySelector('.newsletter-pop');
  const backdrop = document.querySelector('.newsletter-pop__backdrop');
  const popBody = popup && popup.querySelector('.newsletter-pop__body');
  const popClose = popup && popup.querySelector('.newsletter-pop__close');

  if (!nav) return;

  // Versteckte Panels sofort inert setzen, damit sie nicht per Tab erreichbar sind
  if (mobileMenu) mobileMenu.setAttribute('inert', '');
  if (popup)      popup.setAttribute('inert', '');

  const isSolid = nav.classList.contains('solid');

  function updateLogo() {
    if (!logoImg) return;
    const dark = (nav.classList.contains('scrolled') || isSolid) && !nav.classList.contains('menu-open');
    const next = dark ? logoImg.dataset.logoDark : logoImg.dataset.logoLight;
    if (next && logoImg.getAttribute('src') !== next) logoImg.setAttribute('src', next);
  }

  if (!isSolid) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
      updateLogo();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  } else {
    updateLogo();
  }

  function setMobileOpen(open) {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('menu-open', open);
    mobileMenu.classList.toggle('open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    if (open) mobileMenu.removeAttribute('inert');
    else      mobileMenu.setAttribute('inert', '');
    mobileMenu.querySelectorAll('a, button').forEach((el) => {
      el.setAttribute('tabindex', open ? '0' : '-1');
    });
    document.body.classList.toggle('popup-open', open || (popup && popup.classList.contains('open')));
    updateLogo();
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => setMobileOpen(!hamburger.classList.contains('open')));
  }

  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => setMobileOpen(false));
    });
  }

  /* Newsletter popup ----------------------------------------------- */
  let newsletterLoaded = false;
  let lastFocus = null;

  async function loadNewsletter() {
    if (newsletterLoaded || !popBody) return;
    try {
      const res = await fetch('data/newsletter.html', { cache: 'no-cache' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      popBody.innerHTML = await res.text();
      newsletterLoaded = true;
      attachFormHandler();
    } catch (err) {
      popBody.innerHTML = '<p>Newsletter-Inhalt konnte nicht geladen werden. Bitte später erneut versuchen.</p>';
    }
  }

  function attachFormHandler() {
    const form = popBody.querySelector('[data-newsletter-form]');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      const note = form.querySelector('.form-note');
      if (note) note.textContent = 'Danke! Wir melden uns bei dir.';
      if (input) input.value = '';
    });
  }

  async function openNewsletter() {
    if (!popup) return;
    lastFocus = document.activeElement;
    setMobileOpen(false);
    await loadNewsletter();
    popup.removeAttribute('inert');
    popup.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    popup.setAttribute('aria-hidden', 'false');
    document.body.classList.add('popup-open');
    setTimeout(() => { if (popClose) popClose.focus(); }, 60);
  }

  function closeNewsletter() {
    if (!popup) return;
    popup.classList.remove('open');
    popup.setAttribute('inert', '');
    if (backdrop) backdrop.classList.remove('open');
    popup.setAttribute('aria-hidden', 'true');
    if (!nav.classList.contains('menu-open')) {
      document.body.classList.remove('popup-open');
    }
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  newsTriggers.forEach((b) => {
    b.addEventListener('click', (e) => { e.preventDefault(); openNewsletter(); });
  });
  if (popClose) popClose.addEventListener('click', closeNewsletter);
  if (backdrop) backdrop.addEventListener('click', closeNewsletter);

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (popup && popup.classList.contains('open')) closeNewsletter();
    else if (mobileMenu && mobileMenu.classList.contains('open')) setMobileOpen(false);
  });

  function startEversportsWidget(widgetEl) {
    const wrap = document.createElement('div');
    wrap.className = 'booking-widget__embed-wrap';
    widgetEl.parentNode.insertBefore(wrap, widgetEl);

    const placeholder = document.createElement('div');
    placeholder.className = 'ev-placeholder';
    placeholder.innerHTML =
      '<strong>Buchungstool wird geladen …</strong>' +
      '<p class="ev-placeholder__loading">Einen Moment bitte — das Tool wird von unserem Buchungspartner geladen.</p>' +
      '<p class="ev-placeholder__stuck">Das Buchungstool ist noch nicht erschienen. Bitte lade die Seite neu — meist hilft das.</p>' +
      '<button type="button" class="btn btn--accent ev-placeholder__reload">Seite neu laden</button>';
    wrap.appendChild(placeholder);
    wrap.appendChild(widgetEl);

    placeholder.querySelector('.ev-placeholder__reload').addEventListener('click', function () {
      window.location.reload();
    });

    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://widget-static.eversports.io/loader.js';
    script.async = true;
    wrap.appendChild(script);

    const stuckTimer = setTimeout(function () {
      if (!placeholder.classList.contains('is-hidden')) placeholder.classList.add('is-stuck');
    }, 8000);

    const pollId = setInterval(function () {
      if (widgetEl.children.length > 0) {
        placeholder.classList.add('is-hidden');
        clearInterval(pollId);
        clearTimeout(stuckTimer);
      }
    }, 400);
  }

  document.querySelectorAll('[data-eversports-widget-id]').forEach(function (widgetEl) {
    const consent = window.cfConsent && window.cfConsent.get();

    if (consent === 'accepted') {
      startEversportsWidget(widgetEl);
      return;
    }

    const notice = document.createElement('div');
    notice.className = 'consent-notice';
    notice.innerHTML =
      '<p>Für die Online-Buchung ist das <b>Eversports</b>-Widget erforderlich.' +
      ' Es überträgt Daten an die Eversports GmbH (Österreich).</p>' +
      '<button type="button" class="btn btn--accent consent-notice__btn">Externe Dienste akzeptieren</button>';
    widgetEl.parentNode.insertBefore(notice, widgetEl);

    function activate() {
      if (!notice.parentNode) return;
      localStorage.setItem('cf_consent', 'accepted');
      const banner = document.getElementById('cookie-banner');
      if (banner) { banner.classList.remove('is-visible'); banner.setAttribute('aria-hidden', 'true'); }
      notice.remove();
      document.dispatchEvent(new CustomEvent('cf:consent'));
      startEversportsWidget(widgetEl);
    }

    notice.querySelector('button').addEventListener('click', activate);

    document.addEventListener('cf:consent', function onGrant() {
      document.removeEventListener('cf:consent', onGrant);
      if (notice.parentNode) { notice.remove(); startEversportsWidget(widgetEl); }
    });
  });
})();
