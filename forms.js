// FAQ accordion
document.querySelectorAll('.faq-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var item = btn.closest('.faq-item');
    document.querySelectorAll('.faq-item').forEach(function (i) {
      if (i !== item) i.classList.remove('open');
    });
    item.classList.toggle('open');
  });
});

// Wire the Stripe "Get My Report" buttons
document.querySelectorAll('[data-stripe-btn]').forEach(function (btn) {
  if (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.stripePaymentLink) {
    btn.href = SITE_CONFIG.stripePaymentLink;
  }
});

// Generic mailto-based form submit.
// Works with zero backend: opens the visitor's email client with a
// pre-filled message to your contactEmail. Good enough to launch with;
// swap this for Formspree / Netlify Forms later if you want silent
// in-page submission instead of opening a mail client.
function wireMailtoForm(formId, subjectPrefix, msgSelector) {
  var form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = form.querySelector(msgSelector);
    var data = new FormData(form);
    var lines = [];
    data.forEach(function (value, key) {
      if (key === 'consent') return;
      lines.push(key + ': ' + value);
    });
    var to = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.contactEmail) || '';
    var subject = encodeURIComponent(subjectPrefix);
    var body = encodeURIComponent(lines.join('\n'));
    if (!to || to.indexOf('REPLACE_WITH') === 0) {
      if (msg) {
        msg.textContent = 'Contact email not configured yet — edit config.js.';
        msg.className = 'form-msg err';
      }
      return;
    }
    window.location.href = 'mailto:' + to + '?subject=' + subject + '&body=' + body;
    if (msg) {
      msg.textContent = 'Opening your email client to send this…';
      msg.className = 'form-msg ok';
    }
  });
}
