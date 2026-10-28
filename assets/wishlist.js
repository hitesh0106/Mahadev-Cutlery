/* ==========================================================================
   Mahadev theme — wishlist.js
   - Device-local wishlist (localStorage key: mc_wishlist_v1)
     Item shape: {handle,title,vendor,price,image,url,addedAt}  (price in paise)
   - Device-local recently viewed (key: mc_recently_viewed_v1, max 12)
   LIMITATION (documented): saved per device/browser only; no cross-device sync,
   no accounts. Clears if the customer clears site data.
   ========================================================================== */
(function () {
  'use strict';

  var WISHLIST_KEY = 'mc_wishlist_v1';
  var RECENT_KEY = 'mc_recently_viewed_v1';
  var WISHLIST_MAX = 50;
  var RECENT_MAX = 12;
  var CHANGE_EVENT = 'mc:wishlist-changed';
  var RECENT_EVENT = 'mc:recently-viewed-changed';

  function readList(key) {
    try {
      var raw = window.localStorage.getItem(key);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(function (item) {
        return item && typeof item.handle === 'string';
      });
    } catch (e) {
      return [];
    }
  }

  function writeList(key, items, eventName) {
    try {
      window.localStorage.setItem(key, JSON.stringify(items));
    } catch (e) {
      /* storage full/blocked — feature degrades silently */
    }
    window.dispatchEvent(new CustomEvent(eventName));
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatMoney(cents) {
    var format = (window.MC && MC.config && MC.config.moneyFormat) || '\u20B9{{amount}}';
    return window.MC && MC.formatMoney ? MC.formatMoney(cents, format) : '₹' + (cents / 100).toFixed(2);
  }

  /* ── Wishlist toggle buttons ──────────────────────────────────────────── */
  function syncButtons() {
    var items = readList(WISHLIST_KEY);
    var handles = {};
    items.forEach(function (item) {
      handles[item.handle] = true;
    });
    document.querySelectorAll('[data-mc-wishlist]').forEach(function (btn) {
      var handle = btn.getAttribute('data-mc-wishlist-handle');
      var active = !!handles[handle];
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
      var label = btn.querySelector('[data-mc-wishlist-label]');
      if (label) {
        label.textContent = active
          ? btn.getAttribute('data-mc-label-added') || 'In wishlist'
          : btn.getAttribute('data-mc-label-add') || 'Add to wishlist';
      }
    });
  }

  function initWishlistButtons() {
    document.querySelectorAll('[data-mc-wishlist]').forEach(function (btn) {
      if (btn.dataset.mcWlBound) return;
      btn.dataset.mcWlBound = 'true';
      btn.addEventListener('click', function () {
        var handle = btn.getAttribute('data-mc-wishlist-handle');
        var raw = btn.getAttribute('data-mc-product');
        if (!raw) return;
        var data;
        try {
          data = JSON.parse(raw);
        } catch (e) {
          return;
        }
        var items = readList(WISHLIST_KEY);
        var exists = items.some(function (item) {
          return item.handle === handle;
        });
        if (exists) {
          writeList(
            WISHLIST_KEY,
            items.filter(function (item) {
              return item.handle !== handle;
            }),
            CHANGE_EVENT,
          );
        } else {
          data.addedAt = new Date().toISOString();
          items.unshift(data);
          writeList(WISHLIST_KEY, items.slice(0, WISHLIST_MAX), CHANGE_EVENT);
        }
        syncButtons();
      });
    });
    syncButtons();
  }

  /* ── Wishlist page rendering ──────────────────────────────────────────── */
  function renderWishlistPage() {
    var listEl = document.querySelector('[data-mc-wishlist-list]');
    if (!listEl) return;
    var items = readList(WISHLIST_KEY);
    var emptyEl = document.querySelector('[data-mc-wishlist-empty]');
    listEl.innerHTML = '';
    if (!items.length) {
      if (emptyEl) emptyEl.hidden = false;
      return;
    }
    if (emptyEl) emptyEl.hidden = true;

    items.forEach(function (item) {
      var html =
        '<article class="mc-card mc-wishlist-item">' +
        '<a class="mc-card__media" href="' + escapeHtml(item.url) + '">' +
        (item.image
          ? '<img class="mc-card__img" src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.title) + '" width="600" height="750" loading="lazy">'
          : '<span class="mc-card__placeholder" aria-hidden="true"></span>') +
        '</a>' +
        '<div class="mc-card__body">' +
        (item.vendor ? '<p class="mc-card__vendor">' + escapeHtml(item.vendor) + '</p>' : '') +
        '<h3 class="mc-card__title"><a href="' + escapeHtml(item.url) + '">' + escapeHtml(item.title) + '</a></h3>' +
        '<span class="mc-price mc-card__price"><span class="mc-price__current">' + formatMoney(item.price) + '</span></span>' +
        '</div>' +
        '<div class="mc-card__actions">' +
        '<button type="button" class="mc-btn mc-btn--secondary mc-btn--sm" data-mc-wishlist-remove="' + escapeHtml(item.handle) + '">Remove</button>' +
        '</div>' +
        '</article>';
      listEl.insertAdjacentHTML('beforeend', html);
    });
  }

  document.addEventListener('click', function (e) {
    var removeBtn = e.target.closest('[data-mc-wishlist-remove]');
    if (!removeBtn) return;
    var handle = removeBtn.getAttribute('data-mc-wishlist-remove');
    writeList(
      WISHLIST_KEY,
      readList(WISHLIST_KEY).filter(function (item) {
        return item.handle !== handle;
      }),
      CHANGE_EVENT,
    );
    renderWishlistPage();
    syncButtons();
  });

  /* ── Recently viewed recording + strip ────────────────────────────────── */
  function recordRecentlyViewed() {
    var island = document.querySelector('[data-mc-current-product]');
    if (!island) return;
    var data;
    try {
      data = JSON.parse(island.textContent);
    } catch (e) {
      return;
    }
    if (!data || !data.handle) return;
    var items = readList(RECENT_KEY).filter(function (item) {
      return item.handle !== data.handle;
    });
    data.addedAt = new Date().toISOString();
    items.unshift(data);
    writeList(RECENT_KEY, items.slice(0, RECENT_MAX), RECENT_EVENT);
  }

  function renderRecentlyViewed() {
    var section = document.querySelector('[data-mc-recently-viewed]');
    if (!section) return;
    var current = section.getAttribute('data-mc-current-handle');
    var items = readList(RECENT_KEY).filter(function (item) {
      return item.handle && item.handle !== current;
    });
    if (!items.length) return; /* stays hidden — never renders fake products */
    section.hidden = false;
    var listEl = section.querySelector('[data-mc-recently-viewed-list]');
    if (!listEl) return;
    listEl.innerHTML = '';
    items.slice(0, 8).forEach(function (item) {
      var html =
        '<article class="mc-card">' +
        '<a class="mc-card__media" href="' + escapeHtml(item.url) + '">' +
        (item.image
          ? '<img class="mc-card__img" src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.title) + '" width="600" height="750" loading="lazy">'
          : '<span class="mc-card__placeholder" aria-hidden="true"></span>') +
        '</a>' +
        '<div class="mc-card__body">' +
        (item.vendor ? '<p class="mc-card__vendor">' + escapeHtml(item.vendor) + '</p>' : '') +
        '<h3 class="mc-card__title"><a href="' + escapeHtml(item.url) + '">' + escapeHtml(item.title) + '</a></h3>' +
        '<span class="mc-price mc-card__price"><span class="mc-price__current">' + formatMoney(item.price) + '</span></span>' +
        '</div>' +
        '</article>';
      listEl.insertAdjacentHTML('beforeend', html);
    });
  }

  /* ── Boot ─────────────────────────────────────────────────────────────── */
  function init() {
    initWishlistButtons();
    renderWishlistPage();
    recordRecentlyViewed();
    renderRecentlyViewed();
    window.addEventListener(CHANGE_EVENT, function () {
      syncButtons();
      renderWishlistPage();
    });
    window.addEventListener('storage', function (e) {
      if (e.key === WISHLIST_KEY || e.key === RECENT_KEY) {
        syncButtons();
        renderWishlistPage();
        renderRecentlyViewed();
      }
    window.addEventListener('shopify:section:load', function () {
      syncButtons();
      renderWishlistPage();
      renderRecentlyViewed();
    });
  }

  window.MC_Wishlist = {
    init: init,
    syncButtons: syncButtons,
    renderWishlistPage: renderWishlistPage,
    renderRecentlyViewed: renderRecentlyViewed
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
