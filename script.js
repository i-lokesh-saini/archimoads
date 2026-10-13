/* ==========================================================================
   ARCHIMO ADS — INTERACTIONS & ANIMATIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- NAVBAR SCROLL ----------
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  const handleNavScroll = () => {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // Init


  // ---------- MOBILE MENU ----------
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = mobileMenu.querySelectorAll('.mobile-link');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });


  // ---------- SMOOTH ANCHOR SCROLLING ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });


  // ---------- REVEAL ON SCROLL (Intersection Observer) ----------
  const revealElements = document.querySelectorAll('.reveal');

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Instantly show all elements
    revealElements.forEach(el => el.classList.add('visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }


  // ---------- CONTACT FORM VALIDATION ----------
  const form = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Clear previous errors
      form.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
      });

      // Validate name
      const nameField = document.getElementById('name');
      if (!nameField.value.trim()) {
        nameField.closest('.form-group').classList.add('error');
        isValid = false;
      }

      // Validate email
      const emailField = document.getElementById('email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailField.value.trim() || !emailRegex.test(emailField.value.trim())) {
        emailField.closest('.form-group').classList.add('error');
        isValid = false;
      }

      // Validate service
      const serviceField = document.getElementById('service');
      if (!serviceField.value) {
        serviceField.closest('.form-group').classList.add('error');
        isValid = false;
      }

      // Validate message
      const messageField = document.getElementById('message');
      if (!messageField.value.trim()) {
        messageField.closest('.form-group').classList.add('error');
        isValid = false;
      }

      if (isValid) {
        // Show success state
        form.style.display = 'none';
        formSuccess.classList.add('show');

        // Scroll success into view
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        // Scroll to first error
        const firstError = form.querySelector('.form-group.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });

    // Real-time validation clear
    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => {
        field.closest('.form-group').classList.remove('error');
      });
      field.addEventListener('change', () => {
        field.closest('.form-group').classList.remove('error');
      });
    });
  }


  // ---------- ACTIVE NAV LINK ON SCROLL ----------
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  const updateActiveNav = () => {
    const scrollY = window.scrollY + navbar.offsetHeight + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinksAll.forEach(link => {
          link.style.color = '';
          const href = link.getAttribute('href');
          if (href === `#${sectionId}`) {
            link.style.color = 'var(--text-primary)';
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNav, { passive: true });


  // ---------- HERO BADGE ROTATION (CSS handles rotation, but we can add parallax) ----------
  const heroBadge = document.querySelector('.hero-badge');
  if (heroBadge && !prefersReducedMotion) {
    // Already handled by CSS animation
  }


  // ---------- KEYBOARD NAVIGATION ----------
  // Ensure focus management for interactive elements
  document.querySelectorAll('.service-card, .project-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const link = card.querySelector('a');
        if (link) link.click();
      }
    });
  });

});
