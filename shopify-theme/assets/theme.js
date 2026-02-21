/* ===== NightForge Theme JS — Resurrect Nutrition ===== */

/* FAQ Accordion */
function toggleFaq(btn) {
  var item = btn.parentElement;
  var answer = item.querySelector('.faq-answer');
  var isActive = item.classList.contains('active');

  document.querySelectorAll('.faq-item').forEach(function(i) {
    i.classList.remove('active');
    i.querySelector('.faq-answer').style.maxHeight = null;
  });

  if (!isActive) {
    item.classList.add('active');
    answer.style.maxHeight = answer.scrollHeight + 'px';
  }
}

/* Scroll Reveal */
document.addEventListener('DOMContentLoaded', function() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  var revealElements = document.querySelectorAll('.benefit-card, .step, .who-card, .comparison-card, .ingredient-item, .tri-blend-form');
  revealElements.forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  /* Mobile Nav Toggle */
  var toggle = document.querySelector('.nav-mobile-toggle');
  if (toggle) {
    toggle.addEventListener('click', function() {
      document.querySelector('.nav-links').classList.toggle('nav-links--open');
    });
  }

  /* Social Proof Rotation */
  if (typeof socialProofMessages !== 'undefined' && socialProofMessages.length > 0) {
    var activityText = document.getElementById('activityText');
    var activityDot = document.querySelector('.recent-activity-dot');
    var proofIndex = 0;

    setInterval(function() {
      proofIndex = (proofIndex + 1) % socialProofMessages.length;
      if (activityText) {
        activityText.style.opacity = '0';
        setTimeout(function() {
          activityText.textContent = socialProofMessages[proofIndex];
          activityText.style.opacity = '1';
        }, 300);
      }
      if (activityDot) {
        activityDot.style.animation = 'none';
        activityDot.offsetHeight; /* trigger reflow */
        activityDot.style.animation = '';
      }
    }, 4000);
  }

  /* Shipping Progress Bar */
  if (typeof freeShippingThreshold !== 'undefined') {
    updateShippingBar();
  }
});

/* Variant Selector */
function selectVariant(el) {
  document.querySelectorAll('.qty-option').forEach(function(opt) {
    opt.classList.remove('selected');
  });
  el.classList.add('selected');

  var variantId = el.getAttribute('data-variant-id');
  var variantPrice = parseInt(el.getAttribute('data-variant-price'), 10);
  var input = document.getElementById('variantInput');
  var priceDisplay = document.getElementById('productPrice');

  if (input) {
    input.value = variantId;
  }
  if (priceDisplay && variantPrice) {
    priceDisplay.textContent = formatMoney(variantPrice);
  }

  updateShippingBar();
}

/* Format Shopify price (cents to dollars) */
function formatMoney(cents) {
  return '$' + (cents / 100).toFixed(2);
}

/* Update free shipping progress bar */
function updateShippingBar() {
  if (typeof freeShippingThreshold === 'undefined') return;

  var selectedOption = document.querySelector('.qty-option.selected');
  var priceInCents = selectedOption ? parseInt(selectedOption.getAttribute('data-variant-price'), 10) : 0;
  var qty = document.getElementById('qty');
  var quantity = qty ? parseInt(qty.value, 10) || 1 : 1;
  var totalCents = priceInCents * quantity;
  var totalDollars = totalCents / 100;
  var thresholdDollars = freeShippingThreshold;

  var fill = document.getElementById('shippingFill');
  var text = document.getElementById('shippingText');

  if (!fill || !text) return;

  if (totalDollars >= thresholdDollars) {
    fill.style.width = '100%';
    text.innerHTML = 'You qualify for <strong>free shipping!</strong>';
  } else {
    var remaining = (thresholdDollars - totalDollars).toFixed(2);
    var pct = Math.min((totalDollars / thresholdDollars) * 100, 100);
    fill.style.width = pct + '%';
    text.innerHTML = 'Add <strong>$' + remaining + '</strong> more for <strong>free shipping</strong>';
  }
}

/* Listen for quantity changes */
document.addEventListener('change', function(e) {
  if (e.target && e.target.id === 'qty') {
    updateShippingBar();
  }
});
