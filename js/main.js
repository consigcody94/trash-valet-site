/**
 * Florida Trash Valet - Main JavaScript
 * Handles all interactive functionality
 */

(function() {
  'use strict';

  // ============================================
  // MOBILE MENU
  // ============================================

  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navList = document.getElementById('navList');

  if (mobileMenuToggle && navList) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenuToggle.classList.toggle('active');
      navList.classList.toggle('active');
      document.body.style.overflow = navList.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('active');
        navList.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ============================================
  // HEADER SCROLL EFFECT
  // ============================================

  const header = document.getElementById('header');

  if (header) {
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    });
  }

  // ============================================
  // QUOTE CALCULATOR
  // ============================================

  const quoteCalculator = document.getElementById('quoteCalculator');

  if (quoteCalculator) {
    const unitCount = document.getElementById('unitCount');
    const unitCountValue = document.getElementById('unitCountValue');
    const frequency = document.getElementById('frequency');
    const frequencyValue = document.getElementById('frequencyValue');
    const propertyType = document.getElementById('propertyType');
    const estimatedPrice = document.getElementById('estimatedPrice');

    // Base pricing per unit per month
    const basePricePerUnit = 12.50;
    const frequencyMultipliers = {
      3: 0.65,
      4: 0.80,
      5: 1.00,
      6: 1.15,
      7: 1.30
    };
    const propertyMultipliers = {
      apartment: 1.00,
      condo: 1.05,
      townhome: 1.10,
      hoa: 1.20
    };

    function calculatePrice() {
      const units = parseInt(unitCount.value);
      const freq = parseInt(frequency.value);
      const type = propertyType.value;

      // Volume discounts
      let discount = 1;
      if (units >= 200) discount = 0.85;
      else if (units >= 100) discount = 0.90;
      else if (units >= 50) discount = 0.95;

      const price = units * basePricePerUnit * frequencyMultipliers[freq] * propertyMultipliers[type] * discount;

      return Math.round(price);
    }

    function updateDisplay() {
      unitCountValue.textContent = unitCount.value;
      frequencyValue.textContent = frequency.value + ' nights/week';

      const price = calculatePrice();
      estimatedPrice.textContent = price.toLocaleString();
    }

    unitCount.addEventListener('input', updateDisplay);
    frequency.addEventListener('input', updateDisplay);
    propertyType.addEventListener('change', updateDisplay);

    // Initial calculation
    updateDisplay();
  }

  // ============================================
  // FAQ ACCORDION
  // ============================================

  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-item__question');

    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other items
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
        });

        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');

      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          const headerHeight = header ? header.offsetHeight : 0;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // ============================================
  // FORM VALIDATION
  // ============================================

  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);

      // Basic validation
      let isValid = true;
      const errors = [];

      if (!data.name || data.name.trim().length < 2) {
        errors.push('Please enter your name');
        isValid = false;
      }

      if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
        isValid = false;
      }

      if (!data.phone || data.phone.replace(/\D/g, '').length < 10) {
        errors.push('Please enter a valid phone number');
        isValid = false;
      }

      if (!data.message || data.message.trim().length < 10) {
        errors.push('Please enter a message (at least 10 characters)');
        isValid = false;
      }

      if (isValid) {
        // Show success message
        showFormMessage('success', 'Thank you! We\'ll be in touch within 2 hours.');
        this.reset();
      } else {
        showFormMessage('error', errors.join('<br>'));
      }
    });
  }

  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function showFormMessage(type, message) {
    // Remove existing messages
    const existingMsg = document.querySelector('.form-message');
    if (existingMsg) existingMsg.remove();

    const msgEl = document.createElement('div');
    msgEl.className = `form-message form-message--${type}`;
    msgEl.innerHTML = message;
    msgEl.style.cssText = `
      padding: 1rem;
      border-radius: 0.5rem;
      margin-top: 1rem;
      ${type === 'success' ? 'background: #D1FAE5; color: #065F46;' : 'background: #FEE2E2; color: #991B1B;'}
    `;

    contactForm.appendChild(msgEl);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      msgEl.remove();
    }, 5000);
  }

  // ============================================
  // ZIP CODE CHECKER
  // ============================================

  const zipChecker = document.getElementById('zipChecker');

  if (zipChecker) {
    const zipInput = document.getElementById('zipInput');
    const zipResult = document.getElementById('zipResult');

    // Florida ZIP code ranges we service
    const serviceableZips = [
      // Orlando area
      { min: 32801, max: 32899 },
      { min: 34701, max: 34799 },
      // Tampa area
      { min: 33601, max: 33699 },
      { min: 34601, max: 34699 },
      // Jacksonville area
      { min: 32099, max: 32299 },
      // Miami area
      { min: 33101, max: 33299 },
      // Fort Lauderdale area
      { min: 33301, max: 33399 },
      // West Palm Beach area
      { min: 33401, max: 33499 },
      // St. Petersburg / Clearwater
      { min: 33701, max: 33799 },
    ];

    zipChecker.addEventListener('submit', function(e) {
      e.preventDefault();

      const zip = parseInt(zipInput.value);

      if (isNaN(zip) || zipInput.value.length !== 5) {
        showZipResult('error', 'Please enter a valid 5-digit ZIP code');
        return;
      }

      const isServiceable = serviceableZips.some(range => zip >= range.min && zip <= range.max);

      if (isServiceable) {
        showZipResult('success', '✓ Great news! We service your area. <a href="contact.html">Get a quote now!</a>');
      } else {
        showZipResult('warning', 'We\'re not in your area yet, but we\'re expanding! <a href="contact.html">Contact us</a> to be notified when we arrive.');
      }
    });

    function showZipResult(type, message) {
      const colors = {
        success: 'background: #D1FAE5; color: #065F46; border: 1px solid #10B981;',
        warning: 'background: #FEF3C7; color: #92400E; border: 1px solid #F59E0B;',
        error: 'background: #FEE2E2; color: #991B1B; border: 1px solid #EF4444;'
      };

      zipResult.innerHTML = message;
      zipResult.style.cssText = `
        padding: 1rem;
        border-radius: 0.5rem;
        margin-top: 1rem;
        ${colors[type]}
      `;
      zipResult.style.display = 'block';
    }
  }

  // ============================================
  // ANIMATION ON SCROLL
  // ============================================

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements that should animate
  document.querySelectorAll('.feature-card, .service-card, .testimonial-card, .step, .team-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });

  // ============================================
  // CHAT BUTTON
  // ============================================

  const chatButton = document.getElementById('chatButton');

  if (chatButton) {
    chatButton.addEventListener('click', () => {
      // This would integrate with your chat service (Intercom, Drift, etc.)
      // For now, we'll show a simple alert
      alert('Chat feature coming soon! For immediate assistance, call us at (555) TRASH-FL');
    });
  }

  // ============================================
  // PHONE NUMBER FORMATTING
  // ============================================

  const phoneInputs = document.querySelectorAll('input[type="tel"]');

  phoneInputs.forEach(input => {
    input.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');

      if (value.length > 0) {
        if (value.length <= 3) {
          value = `(${value}`;
        } else if (value.length <= 6) {
          value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        } else {
          value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        }
      }

      e.target.value = value;
    });
  });

  // ============================================
  // COUNTER ANIMATION
  // ============================================

  function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    function updateCounter() {
      start += increment;
      if (start < target) {
        element.textContent = Math.floor(start).toLocaleString();
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toLocaleString();
      }
    }

    updateCounter();
  }

  // Animate stats when they come into view
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNumber = entry.target.querySelector('.hero__stat-number');
        if (statNumber) {
          const text = statNumber.textContent;
          const value = parseFloat(text.replace(/[^0-9.]/g, ''));

          if (!isNaN(value) && value < 1000) {
            // Don't animate percentages or small numbers
            return;
          }

          if (text.includes('+')) {
            animateCounter(statNumber, value);
            setTimeout(() => {
              statNumber.textContent = value.toLocaleString() + '+';
            }, 2100);
          }
        }
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.hero__stat').forEach(stat => {
    statsObserver.observe(stat);
  });

  // ============================================
  // TESTIMONIAL SLIDER (for mobile)
  // ============================================

  const testimonialGrid = document.querySelector('.testimonials__grid');

  if (testimonialGrid && window.innerWidth <= 640) {
    let isDown = false;
    let startX;
    let scrollLeft;

    testimonialGrid.style.overflowX = 'auto';
    testimonialGrid.style.scrollSnapType = 'x mandatory';
    testimonialGrid.style.WebkitOverflowScrolling = 'touch';

    testimonialGrid.querySelectorAll('.testimonial-card').forEach(card => {
      card.style.scrollSnapAlign = 'start';
      card.style.flexShrink = '0';
      card.style.width = '85vw';
    });
  }

  // ============================================
  // LAZY LOADING IMAGES
  // ============================================

  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.src = img.dataset.src;
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
  }

  // ============================================
  // CURRENT YEAR IN FOOTER
  // ============================================

  const yearElements = document.querySelectorAll('.current-year');
  const currentYear = new Date().getFullYear();

  yearElements.forEach(el => {
    el.textContent = currentYear;
  });

  // ============================================
  // SERVICE AREA MAP INTERACTION
  // ============================================

  const cityItems = document.querySelectorAll('.city-item');

  cityItems.forEach(item => {
    item.addEventListener('click', function() {
      const city = this.textContent.trim();
      window.location.href = `areas.html#${city.toLowerCase().replace(/\s+/g, '-')}`;
    });
  });

  // ============================================
  // SCROLL TO TOP
  // ============================================

  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.innerHTML = '↑';
  scrollTopBtn.className = 'scroll-top-btn';
  scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
  scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 100px;
    right: 24px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--color-primary, #0A7558);
    color: white;
    border: none;
    cursor: pointer;
    font-size: 20px;
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 997;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transition: all 0.3s ease;
  `;

  document.body.appendChild(scrollTopBtn);

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      scrollTopBtn.style.display = 'flex';
    } else {
      scrollTopBtn.style.display = 'none';
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // ============================================
  // PRELOAD CRITICAL RESOURCES
  // ============================================

  // Add preload hints for key pages
  const preloadLinks = ['services.html', 'pricing.html', 'contact.html'];

  preloadLinks.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  });

  console.log('🗑️ Florida Trash Valet website loaded successfully!');

})();
