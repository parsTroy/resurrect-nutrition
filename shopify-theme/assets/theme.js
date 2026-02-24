/* ===== NightForge Theme JS — Resurrect Nutrition ===== */

/* ===== CART DRAWER ===== */

function openCartDrawer() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  refreshCartDrawer();
}

function closeCartDrawer() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function refreshCartDrawer() {
  fetch('/cart.js')
    .then(function(r) { return r.json(); })
    .then(function(cart) {
      renderCartDrawer(cart);
      updateCartCount(cart.item_count);
    });
}

function renderCartDrawer(cart) {
  var itemsEl = document.getElementById('cartItems');
  var emptyEl = document.getElementById('cartEmpty');
  var footerEl = document.getElementById('cartFooter');

  if (cart.item_count === 0) {
    itemsEl.innerHTML = '';
    emptyEl.style.display = 'flex';
    footerEl.style.display = 'none';
    return;
  }

  emptyEl.style.display = 'none';
  footerEl.style.display = 'block';

  var html = '';
  cart.items.forEach(function(item, index) {
    var imgSrc = item.image ? getSizedImage(item.image, '160x') : '';
    var variantTitle = item.variant_title && item.variant_title !== 'Default Title' ? '<p class="cart-item-variant">' + item.variant_title + '</p>' : '';

    html += '<div class="cart-item" data-line="' + (index + 1) + '">'
      + '<div class="cart-item-image">'
      + (imgSrc ? '<img src="' + imgSrc + '" alt="' + escapeHtml(item.title) + '">' : '')
      + '</div>'
      + '<div class="cart-item-info">'
      + '<h4 class="cart-item-title">' + escapeHtml(item.product_title) + '</h4>'
      + variantTitle
      + '<p class="cart-item-price">' + formatMoney(item.price) + '</p>'
      + '<div class="cart-item-controls">'
      + '<div class="cart-item-qty">'
      + '<button onclick="updateDrawerQty(' + (index + 1) + ', ' + (item.quantity - 1) + ')" aria-label="Decrease">-</button>'
      + '<span>' + item.quantity + '</span>'
      + '<button onclick="updateDrawerQty(' + (index + 1) + ', ' + (item.quantity + 1) + ')" aria-label="Increase">+</button>'
      + '</div>'
      + '<button class="cart-item-remove" onclick="updateDrawerQty(' + (index + 1) + ', 0)" aria-label="Remove">'
      + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
      + '</button>'
      + '</div>'
      + '</div>'
      + '<div class="cart-item-line-price">' + formatMoney(item.line_price) + '</div>'
      + '</div>';
  });

  itemsEl.innerHTML = html;

  /* Update subtotal */
  document.getElementById('cartSubtotal').textContent = formatMoney(cart.total_price);

  /* Update shipping bar in drawer */
  updateCartDrawerShipping(cart.total_price);
}

function updateCartDrawerShipping(totalCents) {
  var threshold = (typeof cartShippingThreshold !== 'undefined') ? cartShippingThreshold : 50;
  var totalDollars = totalCents / 100;
  var fill = document.getElementById('cartShippingFill');
  var text = document.getElementById('cartShippingText');

  if (!fill || !text) return;

  if (totalDollars >= threshold) {
    fill.style.width = '100%';
    text.innerHTML = 'You qualify for <strong>free shipping!</strong>';
  } else {
    var remaining = (threshold - totalDollars).toFixed(2);
    var pct = Math.min((totalDollars / threshold) * 100, 100);
    fill.style.width = pct + '%';
    text.innerHTML = 'Add <strong>$' + remaining + '</strong> more for <strong>free shipping</strong>';
  }
}

function updateDrawerQty(line, qty) {
  fetch('/cart/change.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ line: line, quantity: Math.max(0, qty) })
  })
  .then(function(r) { return r.json(); })
  .then(function(cart) {
    renderCartDrawer(cart);
    updateCartCount(cart.item_count);
  });
}

function updateCartCount(count) {
  var badge = document.getElementById('cartCount');
  if (!badge) return;
  if (count > 0) {
    badge.textContent = count;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}

/* For the full cart page */
function changeCartQty(line, qty) {
  fetch('/cart/change.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ line: line, quantity: Math.max(0, qty) })
  })
  .then(function() {
    window.location.reload();
  });
}

function getSizedImage(src, size) {
  if (!src) return '';
  return src.replace(/(\.[^.]+)$/, '_' + size + '$1');
}

function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

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

  /* AJAX Add to Cart — intercepts all product forms */
  document.querySelectorAll('form[action*="/cart/add"]').forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = form.querySelector('[type="submit"]');
      if (!btn || btn.disabled) return;

      var originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span>Adding...</span>';

      var idInput = form.querySelector('[name="id"]');
      var qtyInput = form.querySelector('[name="quantity"]');

      if (!idInput || !idInput.value) {
        btn.disabled = false;
        btn.innerHTML = originalText;
        return;
      }

      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          id: parseInt(idInput.value, 10),
          quantity: qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1
        })
      })
      .then(function(r) {
        if (!r.ok) throw new Error('Add to cart failed: ' + r.status);
        return r.json();
      })
      .then(function(item) {
        btn.innerHTML = '<span>Added!</span> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
        setTimeout(function() {
          btn.disabled = false;
          btn.innerHTML = originalText;
        }, 1500);
        openCartDrawer();
      })
      .catch(function(err) {
        btn.disabled = false;
        btn.innerHTML = originalText;
        console.error('Add to cart error:', err);
      });
    });
  });

  /* Fetch initial cart count */
  fetch('/cart.js')
    .then(function(r) { return r.json(); })
    .then(function(cart) {
      updateCartCount(cart.item_count);
    });
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

/* Founder Story Toggle */
function toggleFounderStory(btn) {
  var story = document.getElementById('founderFullStory');
  var textSpan = btn.querySelector('.founder-story-toggle-text');
  var isOpen = btn.classList.contains('active');

  if (isOpen) {
    story.style.maxHeight = null;
    btn.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
    if (textSpan) textSpan.textContent = "Read the Founder's Story";
  } else {
    story.style.maxHeight = story.scrollHeight + 'px';
    btn.classList.add('active');
    btn.setAttribute('aria-expanded', 'true');
    if (textSpan) textSpan.textContent = 'Close Story';
  }
}

/* Supplement Facts Toggle */
function toggleSuppFacts(btn) {
  var panel = document.getElementById('suppFactsPanel');
  var isOpen = btn.classList.contains('active');

  if (isOpen) {
    panel.style.maxHeight = null;
    btn.classList.remove('active');
  } else {
    panel.style.maxHeight = panel.scrollHeight + 'px';
    btn.classList.add('active');
  }
}
