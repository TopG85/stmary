/**
 * St Mary's Church Handforth — Main JavaScript
 * Handles navigation, accordion/FAQ, contact form, and utilities.
 */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Mobile Navigation Toggle
     ------------------------------------------------------------------ */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks  = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  /* ------------------------------------------------------------------
     Highlight Active Navigation Link
     ------------------------------------------------------------------ */
  (function setActiveNav() {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(function (link) {
      const href = (link.getAttribute('href') || '').split('/').pop();
      if (href === current || (current === '' && href === 'index.html')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  })();

  /* ------------------------------------------------------------------
     FAQ / Accordion
     ------------------------------------------------------------------ */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item   = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('is-open');

      // Optionally close other items (accordion behaviour)
      const container = item.closest('.faq-list');
      if (container) {
        container.querySelectorAll('.faq-item.is-open').forEach(function (openItem) {
          if (openItem !== item) {
            openItem.classList.remove('is-open');
            openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          }
        });
      }

      if (isOpen) {
        item.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ------------------------------------------------------------------
     Contact Form — Client-side validation & success state
     ------------------------------------------------------------------ */
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation
      let valid = true;
      contactForm.querySelectorAll('[required]').forEach(function (field) {
        const group = field.closest('.form-group');
        const error = group && group.querySelector('.form-error');

        if (!field.value.trim()) {
          valid = false;
          field.setAttribute('aria-invalid', 'true');
          field.style.borderColor = 'var(--colour-error)';
          if (error) error.style.display = 'block';
        } else {
          field.removeAttribute('aria-invalid');
          field.style.borderColor = '';
          if (error) error.style.display = 'none';
        }
      });

      // Email format check
      const emailField = contactForm.querySelector('[type="email"]');
      if (emailField && emailField.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailField.value.trim())) {
          valid = false;
          emailField.setAttribute('aria-invalid', 'true');
          emailField.style.borderColor = 'var(--colour-error)';
          const group = emailField.closest('.form-group');
          const error = group && group.querySelector('.form-error');
          if (error) { error.textContent = 'Please enter a valid email address.'; error.style.display = 'block'; }
        }
      }

      if (valid) {
        const successMsg = document.querySelector('.form-success');
        if (successMsg) {
          contactForm.style.display = 'none';
          successMsg.classList.add('is-visible');
          successMsg.focus();
        }
      }
    });

    // Live validation — clear errors on input
    contactForm.querySelectorAll('.form-control').forEach(function (field) {
      field.addEventListener('input', function () {
        if (field.value.trim()) {
          field.removeAttribute('aria-invalid');
          field.style.borderColor = '';
          const group = field.closest('.form-group');
          const error = group && group.querySelector('.form-error');
          if (error) error.style.display = 'none';
        }
      });
    });
  }

  /* ------------------------------------------------------------------
     Smooth scroll for anchor links (supplement to CSS)
     ------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });

  /* ------------------------------------------------------------------
     Hero Image Carousel — Auto-rotates every 20 seconds
     ------------------------------------------------------------------ */
  (function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0) return;

    let currentSlide = 0;
    let carouselInterval;

    function showSlide(index) {
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      slides[index].classList.add('active');
      dots[index].classList.add('active');
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }

    function startCarousel() {
      carouselInterval = setInterval(nextSlide, 20000); // 20 second delay
    }

    function stopCarousel() {
      clearInterval(carouselInterval);
    }

    // Manual dot navigation
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
        stopCarousel();
        startCarousel(); // Reset timer
      });
    });

    startCarousel();
    
    // Pause on hover, resume on mouse leave
    const carousel = document.querySelector('.hero-carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', stopCarousel);
      carousel.addEventListener('mouseleave', startCarousel);
    }
  })();

})();
