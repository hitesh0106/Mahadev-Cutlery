/* ==========================================================================
   Mahadev theme — theme.js (window.MC)
   Nav drawer, mega menus, search toggle, reveals, quantity steppers,
   AJAX cart (Shopify Cart API) with gift-wrap sync, variant picker wiring,
   gift-message counter, WhatsApp message refresh, filters toggle.
   No invented data: everything rendered comes from Shopify responses.
   ========================================================================== */
(function () {
  'use strict';

  var MC = (window.MC = window.MC || {});

  /* ── Config & i18n from Liquid JSON islands ───────────────────────────── */
  function readJSON(selector) {
    var el = document.querySelector(selector);
    if (!el) return {};
    try {
      return JSON.parse(el.textContent);
    } catch (e) {
      console.warn('[Mahadev theme] Invalid JSON island:', selector, e);
      return {};
    }
  }

  var CONFIG = (MC.config = readJSON('[data-mc-config]'));
  var I18N = (MC.i18n = readJSON('[data-mc-i18n]'));
  var REDUCED_MOTION =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function t(key, fallback) {
    return (I18N && I18N[key]) || fallback || '';
  }

  /* ── Money formatting (Shopify money_format string, amounts in paise) ─── */
  function formatMoney(cents, format) {
    if (typeof cents !== 'number' || isNaN(cents)) cents = 0;
    var fmt = format || (CONFIG && CONFIG.moneyFormat) || '\u20B9{{amount}}';
    var value;
    var withCommas = function (n) {
      return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    if (fmt.indexOf('{{amount_no_decimals}}') >= 0) {
      value = withCommas(Math.round(cents / 100));
      return fmt.replace('{{amount_no_decimals}}', value);
    }
    if (fmt.indexOf('{{amount_no_decimals_with_comma_separator}}') >= 0) {
      value = withCommas(Math.round(cents / 100)).replace(/,/g, '.');
      return fmt.replace('{{amount_no_decimals_with_comma_separator}}', value);
    }
    if (fmt.indexOf('{{amount_with_space_separator}}') >= 0) {
      value = withCommas(Math.floor(cents / 100)) + '.' + String(cents % 100).padStart(2, '0');
      return fmt.replace('{{amount_with_space_separator}}', value);
    }
    if (fmt.indexOf('{{amount_with_comma_separator}}') >= 0) {
      value = withCommas(Math.floor(cents / 100)) + ',' + String(cents % 100).padStart(2, '0');
      return fmt.replace('{{amount_with_comma_separator}}', value);
    }
    value = withCommas(Math.floor(cents / 100)) + '.' + String(cents % 100).padStart(2, '0');
    return fmt.replace('{{amount}}', value);
  }
  MC.formatMoney = formatMoney;

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ── Cart API helpers ─────────────────────────────────────────────────── */
  function cartFetch(url, body) {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    }).then(function (res) {
      return res.json().then(function (data) {
        if (!res.ok) throw data;
        return data;
      });
    });
  }

  MC.getCart = function () {
    return fetch((CONFIG && CONFIG.cartUrl ? CONFIG.cartUrl : '/cart') + '.js', {
      headers: { Accept: 'application/json' },
    }).then(function (res) {
      return res.json();
    });
  };

  /* ── Cart drawer rendering ────────────────────────────────────────────── */
  function renderCart(cart) {
    document.querySelectorAll('[data-mc-cart-count-bubble]').forEach(function (el) {
      el.textContent = cart.item_count;
      el.hidden = cart.item_count === 0;
    });

    var itemsEl = document.querySelector('[data-mc-cart-items]');
    var emptyEl = document.querySelector('[data-mc-cart-empty]');
    var footerEl = document.querySelector('[data-mc-cart-footer]');
    if (!itemsEl) return;

    itemsEl.innerHTML = '';

    if (!cart.items || cart.items.length === 0) {
      if (emptyEl) emptyEl.hidden = false;
      if (footerEl) footerEl.hidden = true;
      return;
    }
    if (emptyEl) emptyEl.hidden = true;
    if (footerEl) footerEl.hidden = false;

    cart.items.forEach(function (item) {
      var media = item.image
        ? '<img src="' + escapeHtml(item.image) + '&width=150" alt="' + escapeHtml(item.product_title) + '" width="72" height="90" loading="lazy">'
        : '';
      var html = '<div class="mc-cart-item" data-mc-line-key="' + escapeHtml(item.key) + '">';

      html += '<a class="mc-cart-item__media" href="' + escapeHtml(item.url) + '" tabindex="-1" aria-hidden="true">' + media + '</a>';
      html += '<div>';
      html += '<a class="mc-cart-item__title" href="' + escapeHtml(item.url) + '">' + escapeHtml(item.product_title) + '</a>';
      if (CONFIG.show_vendor !== false && item.vendor) {
        html += '<p class="mc-cart-item__vendor">' + escapeHtml(item.vendor) + '</p>';
      }
      if (item.variant_title && item.variant_title !== 'Default Title') {
        html += '<p class="mc-cart-item__variant">' + escapeHtml(item.variant_title) + '</p>';
      }
      if (item.properties) {
        Object.keys(item.properties).forEach(function (key) {
          var val = item.properties[key];
          if (key.charAt(0) === '_' || val === '' || val == null) return;
          html += '<p class="mc-cart-item__prop">' + escapeHtml(key) + ': ' + escapeHtml(val) + '</p>';
        });
      }
      if (item.line_level_discount_allocations && item.line_level_discount_allocations.length) {
        item.line_level_discount_allocations.forEach(function (d) {
          html += '<p class="mc-cart-item__prop">' + escapeHtml(d.discount_application.title) + ' (&minus;' + formatMoney(d.amount) + ')</p>';
        });
      }
      html += '<p class="mc-cart-item__price">' + formatMoney(item.final_line_price) + '</p>';
      html +=
        '<div class="mc-cart-item__controls">' +
        '<div class="mc-qty" data-mc-qty-wrapper>' +
        '<button type="button" class="mc-qty__btn" data-mc-qty="decrease" data-mc-line-key="' + escapeHtml(item.key) + '" aria-label="' + escapeHtml(t('qtyDecrease', 'Decrease quantity')) + '">&minus;</button>' +
        '<input class="mc-qty__input" type="number" inputmode="numeric" min="0" value="' + item.quantity + '" data-mc-line-qty data-mc-line-key="' + escapeHtml(item.key) + '" aria-label="' + escapeHtml(t('cartQty', 'Quantity')) + '">' +
        '<button type="button" class="mc-qty__btn" data-mc-qty="increase" data-mc-line-key="' + escapeHtml(item.key) + '" aria-label="' + escapeHtml(t('qtyIncrease', 'Increase quantity')) + '">+</button>' +
        '</div>' +
        '<button type="button" class="mc-cart-item__remove" data-mc-line-remove data-mc-line-key="' + escapeHtml(item.key) + '">' + escapeHtml(t('cartRemove', 'Remove')) + '</button>' +
        '</div>';
      html += '</div></div>';
      itemsEl.insertAdjacentHTML('beforeend', html);
    });

    var subtotalEl = document.querySelector('[data-mc-cart-subtotal]');
    if (subtotalEl) subtotalEl.textContent = formatMoney(cart.total_price);
  }

  MC.refreshCart = function () {
    return MC.getCart().then(renderCart);
  };

  /* ── Gift wrap sync (charged mode uses a REAL product) ────────────────── */
  /* Lines for a product carry the hidden property "_for" = product handle.  */
  function syncGiftWrap(handle, quantity) {
    if (!CONFIG.giftWrap || !CONFIG.giftWrap.enabled || !CONFIG.giftWrap.charged) {
      return Promise.resolve();
    }
    if (!CONFIG.giftWrap.variantId) return Promise.resolve();
    return MC.getCart().then(function (cart) {
      var wrapLines = (cart.items || []).filter(function (item) {
        return item.properties && item.properties._for === handle;
      });
      var currentQty = wrapLines.reduce(function (sum, line) {
        return sum + line.quantity;
      }, 0);
      if (quantity > 0 && currentQty < quantity) {
        return cartFetch((CONFIG.cartUrl || '/cart') + '/add.js', {
          items: [
            {
              id: CONFIG.giftWrap.variantId,
              quantity: quantity - currentQty,
              properties: { _for: handle },
            },
          ],
        }).then(function () {
          return MC.refreshCart();
        });
      }
      if (quantity === 0 && wrapLines.length) {
        return Promise.all(
          wrapLines.map(function (line) {
            return cartFetch((CONFIG.cartUrl || '/cart') + '/change.js', {
              id: line.key,
              quantity: 0,
            });
          }),
        ).then(function () {
          return MC.refreshCart();
        });
      }
      return MC.refreshCart();
    });
  }
  MC.syncGiftWrap = syncGiftWrap;

  /* ── Drawer helpers (focus trap, escape) ──────────────────────────────── */
  var lastFocused = null;

  function trapFocus(drawer, event) {
    var focusables = drawer.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (!focusables.length) return;
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function openDrawer(drawer) {
    if (!drawer) return;
    lastFocused = document.activeElement;
    drawer.hidden = false;
    document.body.style.overflow = 'hidden';
    var panel = drawer.querySelector('[data-mc-drawer-panel]');
    var focusTarget = panel && panel.querySelector('button, a, input');
    if (focusTarget) focusTarget.focus();
    drawer.addEventListener('keydown', function drawerKeys(e) {
      if (e.key === 'Escape') {
        closeDrawer(drawer);
        return;
      }
      if (e.key === 'Tab') trapFocus(drawer, e);
    });
    if (!REDUCED_MOTION) drawer.setAttribute('data-mc-open', 'true');
  }

  function closeDrawer(drawer) {
    if (!drawer) return;
    drawer.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }
  MC.closeDrawers = function () {
    document.querySelectorAll('.mc-drawer').forEach(function (d) {
      closeDrawer(d);
    });
  };

  function initDrawers() {
    var navDrawer = document.getElementById('mc-nav-drawer');
    var cartDrawer = document.getElementById('mc-cart-drawer');

    document.querySelectorAll('[data-mc-nav-open]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        btn.setAttribute('aria-expanded', 'true');
        openDrawer(navDrawer);
      });
    });
    document.querySelectorAll('[data-mc-nav-close]').forEach(function (el) {
      el.addEventListener('click', function () {
        document.querySelectorAll('[data-mc-nav-open]').forEach(function (b) {
          b.setAttribute('aria-expanded', 'false');
        });
        closeDrawer(navDrawer);
      });
    });

    document.querySelectorAll('[data-mc-cart-open]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        MC.refreshCart().then(function () {
          openDrawer(cartDrawer);
        });
      });
    });
    document.querySelectorAll('[data-mc-cart-close]').forEach(function (el) {
      el.addEventListener('click', function () {
        closeDrawer(cartDrawer);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') MC.closeDrawers();
    });
  }

  /* ── Mega menus + search toggle ───────────────────────────────────────── */
  function initMenus() {
    var toggles = document.querySelectorAll('[data-mc-menu-toggle]');
    toggles.forEach(function (toggle) {
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        var item = toggle.closest('[data-mc-mega]');
        var isOpen = item.classList.contains('is-open');
        document.querySelectorAll('[data-mc-mega].is-open').forEach(function (other) {
          other.classList.remove('is-open');
          var b = other.querySelector('[data-mc-menu-toggle]');
          if (b) b.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('is-open');
          toggle.setAttribute('aria-expanded', 'true');
        }
      });
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('[data-mc-mega]')) {
        document.querySelectorAll('[data-mc-mega].is-open').forEach(function (item) {
          item.classList.remove('is-open');
          var b = item.querySelector('[data-mc-menu-toggle]');
          if (b) b.setAttribute('aria-expanded', 'false');
        });
      }
    });

    var searchToggle = document.querySelector('[data-mc-search-toggle]');
    var searchPanel = document.querySelector('[data-mc-search]');
    if (searchToggle && searchPanel) {
      searchToggle.addEventListener('click', function () {
        var willShow = searchPanel.hidden;
        searchPanel.hidden = !willShow;
        searchToggle.setAttribute('aria-expanded', String(willShow));
        if (willShow) {
          var input = searchPanel.querySelector('[data-mc-search-input]');
          if (input) input.focus();
        }
      });
    }

    /* Dynamic desktop nav fitting for custom merchant menus */
    var navContainer = document.querySelector('.mc-nav');
    var navList = document.querySelector('[data-mc-nav-list]');
    if (navContainer && navList) {
      function checkNavFit() {
        if (window.innerWidth < 1024) return;
        var availableWidth = navContainer.clientWidth;
        var totalWidth = navList.scrollWidth;
        if (totalWidth > availableWidth) {
          navList.classList.add('mc-nav__list--compact');
        } else if (availableWidth - totalWidth > 60) {
          navList.classList.remove('mc-nav__list--compact');
        }
      }
      checkNavFit();
      window.addEventListener('resize', checkNavFit, { passive: true });
    }
  }

  /* ── Reveal on scroll ─────────────────────────────────────────────────── */
  function initReveals() {
    var items = document.querySelectorAll('.mc-reveal');
    if (!items.length) return;
    if (REDUCED_MOTION || !('IntersectionObserver' in window)) {
      items.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    items.forEach(function (el) {
      observer.observe(el);
    });
  }
  MC.initReveals = initReveals;

  /* ── Quantity steppers (product form + rendered cart lines) ───────────── */
  function bindQty(context) {
    (context || document).querySelectorAll('[data-mc-qty-wrapper]').forEach(function (wrap) {
      if (wrap.dataset.mcQtyBound) return;
      wrap.dataset.mcQtyBound = 'true';
      var input = wrap.querySelector('[data-mc-qty-input]');
      if (!input) return;
      var isCartLine = input.hasAttribute('data-mc-line-qty');
      wrap.querySelectorAll('[data-mc-qty]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var min = parseInt(input.getAttribute('min') || '1', 10);
          var value = parseInt(input.value || '1', 10);
          if (btn.getAttribute('data-mc-qty') === 'decrease') value = Math.max(min, value - 1);
          else value = value + 1;
          input.value = value;
          input.dispatchEvent(new Event('change', { bubbles: true }));
          if (isCartLine) updateLine(input.getAttribute('data-mc-line-key'), value);
        });
      });
    });
  }

  /* ── Cart line updates ────────────────────────────────────────────────── */
  function updateLine(key, quantity) {
    if (!key) return;
    cartFetch((CONFIG.cartUrl || '/cart') + '/change.js', { id: key, quantity: quantity })
      .then(function (cart) {
        renderCart(cart);
        var onCartPage = document.querySelector('[data-mc-cart-page-form]');
        if (onCartPage) window.location.reload();
      })
      .catch(function (err) {
        console.warn('[Mahadev theme] Cart update failed', err);
        showCartError(err);
      });
  }

  function showCartError(err) {
    var message =
      (err && err.description) || t('cartError', 'Sorry, something went wrong. Please try again.');
    var errorEl = document.querySelector('[data-mc-form-error]');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.hidden = false;
    } else {
      console.warn('[Mahadev theme]', message);
    }
  }

  document.addEventListener('click', function (e) {
    var removeBtn = e.target.closest('[data-mc-line-remove]');
    if (removeBtn) {
      updateLine(removeBtn.getAttribute('data-mc-line-key'), 0);
      return;
    }
    var changeBtn = e.target.closest('[data-mc-cart-change]');
    if (changeBtn) {
      updateLine(changeBtn.getAttribute('data-mc-cart-key'), parseInt(changeBtn.getAttribute('data-mc-cart-qty') || '0', 10));
    }
  });

  document.addEventListener('change', function (e) {
    var lineQty = e.target.closest('[data-mc-line-qty]');
    if (lineQty && !lineQty.hasAttribute('data-mc-qty-input')) {
      var min = parseInt(lineQty.getAttribute('min') || '0', 10);
      var value = parseInt(lineQty.value || '0', 10);
      if (isNaN(value) || value < min) value = min;
      updateLine(lineQty.getAttribute('data-mc-line-key'), value);
    }
  });

  /* ── Product page: variants, gift wrap, WhatsApp, add-to-cart ─────────── */
  function initProductPage() {
    var root = document.querySelector('[data-mc-product-page]');
    if (!root) return;

    var productData = readJSON('[data-mc-product-json]');
    var currentHandle = root.getAttribute('data-mc-product-handle');
    var selects = Array.prototype.slice.call(root.querySelectorAll('[data-mc-option-select]'));
    var variantInput = root.querySelector('[data-mc-variant-id]');
    var formQty = root.querySelector('[data-mc-form-quantity]');
    var addBtn = root.querySelector('[data-mc-add-button]');
    var addLabel = root.querySelector('[data-mc-add-label]');
    var priceEl = root.querySelector('[data-mc-price-value]');
    var availabilityEl = root.querySelector('[data-mc-availability]');
    var skuEl = root.querySelector('[data-mc-sku]');
    var mainImg = root.querySelector('[data-mc-main-image]');
    var waLink = root.querySelector('[data-mc-wa-link]');

    function currentSelection() {
      return selects.map(function (select) {
        return select.value;
      });
    }

    function findVariant() {
      var selection = currentSelection();
      return (productData.variants || []).find(function (variant) {
        return variant.options && selection.every(function (value, index) {
          return String(variant.options[index]) === String(value);
        });
      });
    }

    function refreshWhatsApp(variant) {
      if (!waLink) return;
      var template = waLink.getAttribute('data-mc-wa-template') || '';
      var qty = formQty ? formQty.value : '1';
      var message = template
        .replace('{variant}', variant && variant.title ? variant.title : 'Default')
        .replace('{qty}', qty);
      waLink.setAttribute(
        'href',
        'https://wa.me/' + (waLink.getAttribute('data-mc-wa-number') || '') + '?text=' + encodeURIComponent(message),
      );
    }

    function applyVariant(variant) {
      if (!variant) {
        if (addBtn) addBtn.disabled = true;
        if (addLabel) addLabel.textContent = t('unavailable', 'Unavailable');
        if (availabilityEl) {
          availabilityEl.innerHTML = '<span class="mc-badge mc-badge--soldout">' + escapeHtml(t('unavailable', 'Unavailable')) + '</span>';
        }
        refreshWhatsApp(null);
        return;
      }
      if (variantInput) variantInput.value = variant.id;
      if (priceEl) priceEl.textContent = formatMoney(variant.price);
      if (skuEl) skuEl.textContent = variant.sku || '';
      if (availabilityEl) {
        availabilityEl.innerHTML = variant.available
          ? '<span class="mc-badge mc-badge--instock">' + escapeHtml(t('inStock', 'In stock')) + '</span>'
          : '<span class="mc-badge mc-badge--soldout">' + escapeHtml(t('soldOut', 'Sold out')) + '</span>';
      }
      if (addBtn) addBtn.disabled = !variant.available;
      if (addLabel) addLabel.textContent = variant.available ? t('addToCart', 'Add to cart') : t('soldOut', 'Sold out');
      if (mainImg && variant.featuredMediaId) {
        var thumb = root.querySelector('[data-mc-media-id="' + variant.featuredMediaId + '"]');
        if (thumb) {
          mainImg.src = thumb.getAttribute('data-mc-thumb-src') || mainImg.src;
          mainImg.alt = thumb.getAttribute('data-mc-thumb-alt') || mainImg.alt;
        }
      }
      refreshWhatsApp(variant);
    }

    selects.forEach(function (select) {
      select.addEventListener('change', function () {
        applyVariant(findVariant());
      });
    });

    /* Qty stepper on the product form keeps hidden form quantity in sync */
    var qtyWrap = root.querySelector('.mc-product__qty [data-mc-qty-wrapper]');
    if (qtyWrap && formQty) {
      var qtyInput = qtyWrap.querySelector('[data-mc-qty-input]');
      qtyInput.addEventListener('change', function () {
        var value = Math.max(1, parseInt(qtyInput.value || '1', 10));
        qtyInput.value = value;
        formQty.value = value;
        refreshWhatsApp(findVariant());
      });
    }

    /* Gallery thumbnails */
    root.querySelectorAll('[data-mc-thumb]').forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        root.querySelectorAll('[data-mc-thumb]').forEach(function (other) {
          other.classList.remove('is-active');
        });
        thumb.classList.add('is-active');
        if (mainImg) {
          mainImg.src = thumb.getAttribute('data-mc-thumb-src') || mainImg.src;
          mainImg.alt = thumb.getAttribute('data-mc-thumb-alt') || mainImg.alt;
        }
      });
    });

    /* Gift wrap toggle: show fields + disable message textarea when unchecked */
    var giftToggle = root.querySelector('[data-mc-gift-wrap-toggle]');
    var giftFields = root.querySelector('[data-mc-gift-wrap-fields]');
    var giftMessage = root.querySelector('[data-mc-gift-message]');
    if (giftToggle && giftFields) {
      giftToggle.addEventListener('change', function () {
        giftFields.hidden = !giftToggle.checked;
        if (giftMessage) {
          giftMessage.disabled = !giftToggle.checked;
          if (!giftToggle.checked) giftMessage.value = '';
        }
      });
      if (giftMessage) giftMessage.disabled = !giftToggle.checked;
    }
    var giftCount = root.querySelector('[data-mc-gift-count]');
    if (giftMessage && giftCount) {
      giftMessage.addEventListener('input', function () {
        if (giftMessage.value.length > 200) giftMessage.value = giftMessage.value.slice(0, 200);
        giftCount.textContent = (200 - giftMessage.value.length) + ' ' + 'characters left';
      });
    }

    /* Add to cart (AJAX) */
    var form = root.querySelector('[data-mc-product-form]');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var errorEl = root.querySelector('[data-mc-form-error]');
        if (errorEl) errorEl.hidden = true;

        var variant = findVariant() || { id: parseInt(variantInput ? variantInput.value : '0', 10), title: 'Default' };
        var quantity = formQty ? Math.max(1, parseInt(formQty.value || '1', 10)) : 1;
        var properties = {};
        if (giftToggle && giftToggle.checked) {
          properties['Gift wrap'] = 'Yes';
          if (giftMessage && giftMessage.value.trim() !== '') {
            properties['Gift message'] = giftMessage.value.trim().slice(0, 200);
          }
        }

        if (addBtn) {
          addBtn.disabled = true;
          if (addLabel) addLabel.textContent = t('adding', 'Adding…');
        }

        var items = [
          {
            id: variant.id,
            quantity: quantity,
            properties: properties,
          },
        ];

        cartFetch((CONFIG.cartUrl || '/cart') + '/add.js', { items: items })
          .then(function () {
            return syncGiftWrap(currentHandle, giftToggle && giftToggle.checked ? quantity : 0);
          })
          .then(function () {
            return MC.refreshCart();
          })
          .then(function () {
            if (addBtn) {
              addBtn.disabled = !variant.available;
              if (addLabel) addLabel.textContent = variant.available ? t('addToCart', 'Add to cart') : t('soldOut', 'Sold out');
            }
            var cartDrawer = document.getElementById('mc-cart-drawer');
            if (cartDrawer && CONFIG.cartType !== 'page') {
              openDrawer(cartDrawer);
            } else if (CONFIG.cartUrl) {
              window.location.href = CONFIG.cartUrl;
            }
          })
          .catch(function (err) {
            if (addBtn) {
              addBtn.disabled = false;
              if (addLabel) addLabel.textContent = t('addToCart', 'Add to cart');
            }
            showCartError(err);
          });
      });
    }
  }

  /* ── Filters toggle (collection page) ─────────────────────────────────── */
  function initFilters() {
    var toggle = document.querySelector('[data-mc-filters-toggle]');
    var panel = document.querySelector('[data-mc-filters-panel]');
    if (toggle && panel) {
      toggle.addEventListener('click', function () {
        var willShow = panel.hidden;
        panel.hidden = !willShow;
        toggle.setAttribute('aria-expanded', String(willShow));
      });
    }
  }

  /* ── Cart page form (works without JS; JS only enhances steppers) ─────── */
  function initCartPage() {
    var form = document.querySelector('[data-mc-cart-page-form]');
    if (!form) return;
    bindQty(form);
  }

  /* ── Boot ─────────────────────────────────────────────────────────────── */
  function initCarousels(root) {
    var scope = root || document;
    var sections = scope.querySelectorAll('.mc-featured-products');
    sections.forEach(function (sec) {
      var track = sec.querySelector('[data-carousel-track]');
      var prevBtn = sec.querySelector('[data-carousel-prev]');
      var nextBtn = sec.querySelector('[data-carousel-next]');
      if (!track || !prevBtn || !nextBtn) return;
      if (prevBtn.dataset.bound) return;
      prevBtn.dataset.bound = 'true';

      prevBtn.addEventListener('click', function () {
        var card = track.firstElementChild;
        var step = card ? card.offsetWidth + 24 : 300;
        track.scrollBy({ left: -step, behavior: 'smooth' });
      });

      nextBtn.addEventListener('click', function () {
        var card = track.firstElementChild;
        var step = card ? card.offsetWidth + 24 : 300;
        track.scrollBy({ left: step, behavior: 'smooth' });
      });
    });
  }

  function init() {
    initDrawers();
    initMenus();
    initReveals();
    bindQty(document);
    initProductPage();
    initFilters();
    initCartPage();
    initCarousels();
    MC.refreshCart();
  }

  /* ── Shopify Theme Editor lifecycle ──────────────────────────────────── */
  document.addEventListener('shopify:section:load', function (evt) {
    var section = evt.target;
    initDrawers();
    initMenus();
    initReveals();
    bindQty(section);
    initCarousels(section);
    if (section.querySelector('[data-mc-product-page]')) {
      initProductPage();
    }
    if (section.querySelector('[data-mc-filters-toggle]')) {
      initFilters();
    }
    if (section.querySelector('[data-mc-cart-page-form]')) {
      initCartPage();
    }
    if (window.MC_Wishlist && typeof window.MC_Wishlist.init === 'function') {
      window.MC_Wishlist.init();
    }
    if (window.MC_Countdown && typeof window.MC_Countdown.init === 'function') {
      window.MC_Countdown.init();
    }
    if (window.MC_GiftFinder && typeof window.MC_GiftFinder.init === 'function') {
      window.MC_GiftFinder.init();
    }
  });

  document.addEventListener('shopify:section:select', function () {
    initReveals();
  });

  MC.init = init;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
