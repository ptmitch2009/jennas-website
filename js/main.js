/* ============================================
   JENNA CLECKLER INSURANCE — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollAnimations();
  initAccordions();
  initScrollTop();
  initNavHighlight();
});

/* --- Navigation --- */
function initNavigation() {
  const hamburger = document.querySelector('.nav__hamburger');
  const navLinks = document.querySelector('.nav__links');
  const overlay = document.querySelector('.nav__overlay');
  const nav = document.querySelector('.nav');
  const links = navLinks ? navLinks.querySelectorAll('.nav__link, .nav__cta') : [];

  // Hamburger toggle
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.contains('open');
      toggleNav(!isOpen);
    });
  }

  // Overlay close
  if (overlay) {
    overlay.addEventListener('click', () => toggleNav(false));
  }

  // Close on link click (mobile)
  links.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 900) {
        toggleNav(false);
      }
    });
  });

  function toggleNav(open) {
    hamburger.classList.toggle('active', open);
    navLinks.classList.toggle('open', open);
    if (overlay) overlay.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  // Scroll detection for nav background
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 20;
    if (nav) nav.classList.toggle('scrolled', scrolled);
    lastScroll = window.scrollY;
  }, { passive: true });
}

/* --- Scroll Animations (Intersection Observer) --- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-up');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all elements
    elements.forEach(el => el.classList.add('visible'));
  }
}

/* --- Accordion / FAQ --- */
function initAccordions() {
  const triggers = document.querySelectorAll('.accordion-trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.parentElement;
      const content = item.querySelector('.accordion-content');
      const isActive = item.classList.contains('active');

      // Close all others
      document.querySelectorAll('.accordion-item.active').forEach(activeItem => {
        if (activeItem !== item) {
          activeItem.classList.remove('active');
          activeItem.querySelector('.accordion-content').style.maxHeight = '0';
        }
      });

      // Toggle current
      item.classList.toggle('active', !isActive);
      content.style.maxHeight = isActive ? '0' : content.scrollHeight + 'px';
    });
  });
}

/* --- Scroll to Top --- */
function initScrollTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --- Active Nav Highlight --- */
function initNavHighlight() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav__link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* --- Form Validation & Submission --- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const fields = form.querySelectorAll('[required]');
    let valid = true;

    fields.forEach(field => {
      const parent = field.closest('.form-group');
      const error = parent.querySelector('.form-error');
      if (error) error.remove();

      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = 'var(--color-error)';
        const msg = document.createElement('span');
        msg.className = 'form-error';
        msg.style.color = 'var(--color-error)';
        msg.style.fontSize = '0.82rem';
        msg.style.marginTop = '4px';
        msg.style.display = 'block';
        msg.textContent = 'This field is required';
        parent.appendChild(msg);
      } else {
        field.style.borderColor = '';
      }
    });

    // Email validation
    const emailField = form.querySelector('[type="email"]');
    if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      valid = false;
      emailField.style.borderColor = 'var(--color-error)';
    }

    // Phone validation
    const phoneField = form.querySelector('[type="tel"]');
    if (phoneField && phoneField.value && !/^[\d\s\-\(\)\+]{7,}$/.test(phoneField.value)) {
      valid = false;
      phoneField.style.borderColor = 'var(--color-error)';
    }

    if (valid) {
      // Show success state
      const btn = form.querySelector('.btn');
      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      // Submit via Netlify Forms
      const formData = new FormData(form);
      fetch(form.getAttribute('action') || window.location.pathname, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      }).then((response) => {
        if (response.ok) {
          btn.textContent = 'Message Sent!';
          btn.style.background = 'var(--color-success)';
          form.reset();
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
          }, 4000);
        } else {
          throw new Error('Form submission failed');
        }
      }).catch(() => {
        btn.textContent = 'Error — Try Again';
        btn.style.background = 'var(--color-error)';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      });
    }
  });
}

// Initialize form when DOM ready
document.addEventListener('DOMContentLoaded', initContactForm);

/* --- Smooth scroll for anchor links --- */
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;

  const target = document.querySelector(link.getAttribute('href'));
  if (target) {
    e.preventDefault();
    const offset = 80; // nav height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
});
