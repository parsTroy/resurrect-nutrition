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
});
