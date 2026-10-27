/* ==========================================================================
   Mahadev theme — gift-finder.js
   3-step gift finder (occasion → recipient → budget). Recommends ONLY real
   products embedded server-side in <script data-mc-gift-products> — filtered
   by gf-* tags (SPEC §5) and availability. Graceful empty state, reset,
   keyboard accessible (radiogroups with arrow keys), mobile-first.
   ========================================================================== */
(function () {
  'use strict';

  var STEPS = ['occasion', 'recipient', 'budget'];
  var TOTAL_STEPS = STEPS.length;

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

  function initFinder(root) {
    var productsEl = root.querySelector('[data-mc-gift-products]');
    var products = [];
    if (productsEl) {
      try {
        var parsed = JSON.parse(productsEl.textContent);
        if (Array.isArray(parsed)) products = parsed;
      } catch (e) {
        console.warn('[Mahadev theme] Gift finder: invalid product JSON', e);
      }
    }
    if (!products.length) return; /* section renders the honest empty note itself */

    var choices = { occasion: null, recipient: null, budget: null };
    var panels = {};
    STEPS.forEach(function (step) {
      panels[step] = root.querySelector('[data-mc-gf-panel="' + step + '"]');
    });
    var resultsPanel = root.querySelector('[data-mc-gf-panel="results"]');
    var progressEl = root.querySelector('[data-mc-gf-progress]');
    var countEl = root.querySelector('[data-mc-gf-count]');
    var resultsEl = root.querySelector('[data-mc-gf-results]');
    var emptyEl = root.querySelector('[data-mc-gf-empty]');

    function showPanel(name) {
      Object.keys(panels).forEach(function (key) {
        if (panels[key]) panels[key].hidden = key !== name;
      });
      if (resultsPanel) resultsPanel.hidden = name !== 'results';
      var active = root.querySelector('[data-mc-gf-panel="' + name + '"]');
      if (active) {
        var focusable = active.querySelector('button, a, input');
        if (focusable) focusable.focus({ preventScroll: true });
      }
      updateProgress(name);
    }

    function updateProgress(activeName) {
      if (!progressEl) return;
      var index = activeName === 'results' ? TOTAL_STEPS : STEPS.indexOf(activeName) + 1;
      progressEl.textContent = 'Step ' + index + ' of ' + TOTAL_STEPS;
    }

    function markSelection(step) {
      root.querySelectorAll('[data-mc-gf-choice="' + step + '"]').forEach(function (btn) {
        var active = btn.getAttribute('data-mc-gf-value') === choices[step];
        btn.setAttribute('aria-checked', String(active));
      });
    }

    function results() {
      return products.filter(function (product) {
        if (!product.available) return false;
        var tags = product.tags || [];
        return (
          (!choices.occasion || tags.indexOf(choices.occasion) >= 0) &&
          (!choices.recipient || tags.indexOf(choices.recipient) >= 0) &&
          (!choices.budget || tags.indexOf(choices.budget) >= 0)
        );
      });
    }

    function renderResults() {
      var matches = results();
      if (countEl) {
        countEl.textContent = matches.length === 1 ? '1 gift idea found' : matches.length + ' gift ideas found';
      }
      if (emptyEl) emptyEl.hidden = matches.length !== 0;
      if (!resultsEl) return;
      resultsEl.innerHTML = '';
      matches.forEach(function (product) {
        var html =
          '<article class="mc-card">' +
          '<a class="mc-card__media" href="' + escapeHtml(product.url) + '">' +
          (product.image
            ? '<img class="mc-card__img" src="' + escapeHtml(product.image) + '" alt="' + escapeHtml(product.title) + '" width="600" height="750" loading="lazy">'
            : '<span class="mc-card__placeholder" aria-hidden="true"></span>') +
          '<span class="mc-card__badges"></span>' +
          '</a>' +
          '<div class="mc-card__body">' +
          (product.vendor ? '<p class="mc-card__vendor">' + escapeHtml(product.vendor) + '</p>' : '') +
          '<h3 class="mc-card__title"><a href="' + escapeHtml(product.url) + '">' + escapeHtml(product.title) + '</a></h3>' +
          '<span class="mc-price mc-card__price"><span class="mc-price__current">' + formatMoney(product.price) + '</span></span>' +
          '</div>' +
          '<div class="mc-card__actions">' +
          '<a class="mc-btn mc-btn--secondary mc-btn--sm" href="' + escapeHtml(product.url) + '">View product</a>' +
          '</div>' +
          '</article>';
        resultsEl.insertAdjacentHTML('beforeend', html);
      });
    }

    /* Choice buttons */
    root.querySelectorAll('[data-mc-gf-choice]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var step = btn.getAttribute('data-mc-gf-choice');
        choices[step] = btn.getAttribute('data-mc-gf-value');
        markSelection(step);
        if (step === 'occasion') showPanel('recipient');
        else if (step === 'recipient') showPanel('budget');
        else {
          renderResults();
          showPanel('results');
        }
      });
    });

    /* Back buttons: occasion → restart, recipient → occasion, budget → recipient, results → budget */
    root.querySelectorAll('[data-mc-gf-back]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var panel = btn.closest('[data-mc-gf-panel]');
        var name = panel ? panel.getAttribute('data-mc-gf-panel') : 'occasion';
        if (name === 'recipient') showPanel('occasion');
        else if (name === 'budget') showPanel('recipient');
        else if (name === 'results') showPanel('budget');
        else {
          choices = { occasion: null, recipient: null, budget: null };
          markAll();
          showPanel('occasion');
        }
      });
    });

    function markAll() {
      STEPS.forEach(markSelection);
    }

    /* Reset */
    var resetBtn = root.querySelector('[data-mc-gf-reset]');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        choices = { occasion: null, recipient: null, budget: null };
        markAll();
        showPanel('occasion');
      });
    }

    /* Arrow-key support for radiogroups */
    root.querySelectorAll('[data-mc-gf-choice]').forEach(function (btn) {
      btn.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        e.preventDefault();
        var step = btn.getAttribute('data-mc-gf-choice');
        var group = Array.prototype.slice.call(root.querySelectorAll('[data-mc-gf-choice="' + step + '"]'));
        var index = group.indexOf(btn);
        var nextIndex = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? index + 1 : index - 1;
        var next = group[(nextIndex + group.length) % group.length];
        if (next) next.focus();
      });
    });

    updateProgress('occasion');
  }

  function init() {
    document.querySelectorAll('[data-mc-gift-finder]').forEach(initFinder);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
