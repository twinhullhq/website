/* Twinhull field-notes sign-up.
 * Posts the form to the delivery worker as JSON and shows the result in place.
 * Without JavaScript (or if the request fails) the form posts normally and the
 * worker redirects to /check-email.html. */
(function () {
  "use strict";
  var MESSAGES = {
    ok: "Almost done: check your inbox and click the confirmation link.",
    already: "You're already subscribed. Thanks!",
    invalid: "That email address doesn't look right.",
    busy: "Too many sign-ups today. Please try again tomorrow.",
    error: "Something went wrong. Please try again, or email support@twinhullhq.com."
  };

  document.addEventListener("submit", function (ev) {
    var form = ev.target;
    if (!form.classList || !form.classList.contains("signup-form") || !window.fetch) return;
    ev.preventDefault();
    var msg = form.querySelector(".signup-msg");
    var btn = form.querySelector("button");
    var say = function (key) { msg.textContent = MESSAGES[key]; msg.dataset.state = key; };
    btn.disabled = true;
    fetch(form.action, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ email: form.email.value, website: form.website.value })
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (d) {
        if (r.ok) { say(d.already ? "already" : "ok"); form.email.value = ""; }
        else if (r.status === 400) say("invalid");
        else if (r.status === 503) say("busy");
        else say("error");
      });
    }).catch(function () {
      form.submit();          // network/CORS trouble: fall back to a normal form post
    }).then(function () { btn.disabled = false; });
  });
})();
