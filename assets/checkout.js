/* Twinhull checkout.
 * Paddle.js is loaded only when a visitor clicks a Buy button, so browsing the
 * site makes no third-party requests. If the script can't load, the button's
 * href (a mailto link) is followed instead, so nobody hits a dead end. */
(function () {
  "use strict";
  var TOKEN = "live_71f6ae03bfb069e49326850d9c0";
  var PRICES = { solo: "pri_01m3j57rsr0dwsjwrt43ev5bbz", team: "pri_01m3j58pb85nj6vyngdc2wzbrt" };
  var SRC = "https://cdn.paddle.com/paddle/v2/paddle.js";
  var ready = null;

  function load() {
    if (ready) return ready;
    ready = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = SRC; s.async = true;
      s.onload = function () {
        try {
          window.Paddle.Initialize({
            token: TOKEN,
            checkout: { settings: {
              displayMode: "overlay",
              theme: window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
              locale: "en",
              successUrl: location.origin + "/thanks.html"
            } }
          });
          resolve(window.Paddle);
        } catch (e) { reject(e); }
      };
      s.onerror = reject;
      document.head.appendChild(s);
    });
    ready.catch(function () { ready = null; });
    return ready;
  }

  document.addEventListener("click", function (ev) {
    var a = ev.target.closest && ev.target.closest("a.buy[data-plan]");
    if (!a || !PRICES[a.dataset.plan]) return;
    ev.preventDefault();
    var label = a.textContent;
    a.setAttribute("aria-busy", "true"); a.textContent = "Opening secure checkout…";
    load().then(function (P) {
      P.Checkout.open({ items: [{ priceId: PRICES[a.dataset.plan], quantity: 1 }] });
    }).catch(function () {
      location.href = a.getAttribute("href");
    }).then(function () {
      a.removeAttribute("aria-busy"); a.textContent = label;
    });
  });

})();
