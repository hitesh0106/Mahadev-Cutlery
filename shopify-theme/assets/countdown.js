/* ==========================================================================
   Mahadev theme — countdown.js
   Festival countdown ticker in Asia/Kolkata (IST, UTC+05:30 — no DST, so a
   fixed offset is exact). Server-side Liquid already hides banners whose
   "hide after N days" window has passed; this script:
   - ticks days/hours/minutes/seconds to data-target (YYYY-MM-DD at IST midnight)
   - between the festival date and data-show-until, swaps the ticker for the
     honest "ended" note
   - stops cleanly at zero (never shows a fake countdown)
   ========================================================================== */
(function () {
  'use strict';

  var IST_OFFSET_MINUTES = 330; /* Asia/Kolkata */

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  /* Current time in IST as {y,m,d,h,min,s,ms} using Intl parts */
  function istNow() {
    var parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).formatToParts(new Date());
    var map = {};
    parts.forEach(function (part) {
      if (part.type !== 'literal') map[part.type] = part.value;
    });
    /* Date.UTC(y, m-1, d) minus offset converts IST wall clock to a real epoch */
    var asUTC = Date.UTC(
      Number(map.year),
      Number(map.month) - 1,
      Number(map.day),
      Number(map.hour) % 24,
      Number(map.minute),
      Number(map.second),
    );
    return { epoch: asUTC - IST_OFFSET_MINUTES * 60 * 1000 };
  }

  /* Target: "YYYY-MM-DD" at IST midnight → epoch ms */
  function parseTarget(value) {
    if (!value) return NaN;
    var match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value).trim());
    if (!match) return NaN;
    var utc = Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 0, 0, 0);
    return utc - IST_OFFSET_MINUTES * 60 * 1000;
  }

  function initCountdown(section) {
    var target = parseTarget(section.getAttribute('data-target'));
    if (isNaN(target)) {
      section.hidden = true;
      return;
    }
    var showUntil = Number(section.getAttribute('data-show-until') || target);
    var daysEl = section.querySelector('[data-mc-countdown-days]');
    var hoursEl = section.querySelector('[data-mc-countdown-hours]');
    var minutesEl = section.querySelector('[data-mc-countdown-minutes]');
    var secondsEl = section.querySelector('[data-mc-countdown-seconds]');
    var tickerEl = section.querySelector('[data-mc-countdown-ticker]');
    var expiredEl = section.querySelector('[data-mc-countdown-expired]');

    function tick() {
      var now = istNow().epoch;
      if (now >= showUntil) {
        section.hidden = true; /* hide window passed — server agrees */
        return;
      }
      if (now >= target) {
        /* Festival started but still inside the "show" window: honest ended note */
        if (tickerEl) tickerEl.hidden = true;
        if (expiredEl) expiredEl.hidden = false;
        return;
      }
      var diff = target - now;
      var days = Math.floor(diff / 86400000);
      var hours = Math.floor((diff % 86400000) / 3600000);
      var minutes = Math.floor((diff % 3600000) / 60000);
      var seconds = Math.floor((diff % 60000) / 1000);
      if (daysEl) daysEl.textContent = pad(days);
      if (hoursEl) hoursEl.textContent = pad(hours);
      if (minutesEl) minutesEl.textContent = pad(minutes);
      if (secondsEl) secondsEl.textContent = pad(seconds);
    }

    tick();
    var timer = setInterval(function () {
      var now = istNow().epoch;
      if (now >= showUntil) {
        clearInterval(timer);
        section.hidden = true;
        return;
      }
      if (now >= target) {
        clearInterval(timer);
        if (tickerEl) tickerEl.hidden = true;
        if (expiredEl) expiredEl.hidden = false;
        return;
      }
      tick();
    }, 1000);
  }

  function init() {
    document.querySelectorAll('[data-mc-countdown]').forEach(initCountdown);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
