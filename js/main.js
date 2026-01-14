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
    const basePricePerUnit = 10.00;
    const frequencyMultipliers = {
      3: 0.90,
      4: 0.80,
      5: 1.00,
      6: 1.15,
      7: 1.20
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

      const price = units * basePricePerUnit * frequencyMultipliers[freq] * propertyMultipliers[type];

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

      if (!isValid) {
        e.preventDefault();
        showFormMessage('error', errors.join('<br>'));
      }
      // If valid, form submits normally to Netlify
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

    // Florida ZIP code ranges we service (matching areas.html)
    const serviceableZips = [
      // Central Florida - Orlando area
      { min: 32801, max: 32899, city: 'Orlando' },
      { min: 32789, max: 32792, city: 'Winter Park' },
      { min: 34741, max: 34759, city: 'Kissimmee' },
      { min: 32701, max: 32714, city: 'Altamonte Springs' },
      { min: 32746, max: 32746, city: 'Lake Mary' },
      { min: 32771, max: 32773, city: 'Sanford' },
      { min: 34711, max: 34715, city: 'Clermont' },
      { min: 32114, max: 32129, city: 'Daytona Beach' },



    ];

    zipChecker.addEventListener('submit', function(e) {
      e.preventDefault();

      const zip = parseInt(zipInput.value);

      if (isNaN(zip) || zipInput.value.length !== 5) {
        showZipResult('error', 'Please enter a valid 5-digit ZIP code');
        return;
      }

      const matchedArea = serviceableZips.find(range => zip >= range.min && zip <= range.max);

      if (matchedArea) {
        showZipResult('success', `✓ Great news! We service <strong>${matchedArea.city}</strong>. <a href="contact.html">Get a quote now!</a>`);
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
      alert('Chat feature coming soon! For immediate assistance, call us at (407) 801-8823');
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

  console.log('🗑️ Flat Rate Trash Valet website loaded successfully!');

  // ============================================
  // PSYCHOLOGICAL CONVERSION ENHANCEMENTS
  // ============================================

  // --- SCROLL PROGRESS INDICATOR ---
  const scrollProgress = document.createElement('div');
  scrollProgress.className = 'scroll-progress';
  scrollProgress.innerHTML = '<div class="scroll-progress__bar"></div>';
  document.body.prepend(scrollProgress);

  const progressBar = scrollProgress.querySelector('.scroll-progress__bar');

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }
  });


  // --- SOCIAL PROOF TOAST NOTIFICATIONS ---
  const toastMessages = [
    { city: 'Orlando', units: 156, time: '2 hours ago' },
    { city: 'Tampa', units: 89, time: '4 hours ago' },
    { city: 'Jacksonville', units: 234, time: '6 hours ago' },
    { city: 'Miami', units: 312, time: '8 hours ago' },
    { city: 'Winter Park', units: 67, time: '12 hours ago' },
    { city: 'St. Petersburg', units: 145, time: '1 day ago' },
    { city: 'Fort Lauderdale', units: 198, time: '1 day ago' },
    { city: 'Kissimmee', units: 112, time: '2 days ago' }
  ];

  function showSocialProofToast() {
    const randomMsg = toastMessages[Math.floor(Math.random() * toastMessages.length)];

    const toast = document.createElement('div');
    toast.className = 'social-proof-toast';
    toast.innerHTML = `
      <div class="toast-icon">🏢</div>
      <div class="toast-content">
        <strong>New Property in ${randomMsg.city}!</strong>
        <span>${randomMsg.units} units signed up ${randomMsg.time}</span>
      </div>
      <button class="toast-close" aria-label="Close">×</button>
    `;

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => toast.classList.add('visible'), 100);

    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  }

  // Show first toast after 8 seconds, then every 45 seconds
  setTimeout(() => {
    showSocialProofToast();
    setInterval(showSocialProofToast, 45000);
  }, 8000);

  // --- ENHANCED REVEAL ANIMATIONS ---
  const revealElements = document.querySelectorAll('.reveal-on-scroll, .feature-card, .service-card, .pricing-card, .testimonial-card, .step, .team-card, .faq-item, .area-card');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animation based on index
        setTimeout(() => {
          entry.target.classList.add('revealed');
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    revealObserver.observe(el);
  });

  // --- ANIMATED STAT COUNTERS ---
  function animateValue(element, start, end, duration, suffix = '') {
    const range = end - start;
    const minTimer = 50;
    const stepTime = Math.max(Math.abs(Math.floor(duration / range)), minTimer);
    const startTime = new Date().getTime();
    const endTime = startTime + duration;

    function run() {
      const now = new Date().getTime();
      const remaining = Math.max((endTime - now) / duration, 0);
      const value = Math.round(end - (remaining * range));
      element.textContent = value.toLocaleString() + suffix;
      if (value !== end) {
        requestAnimationFrame(run);
      }
    }
    run();
  }

  const statCounters = document.querySelectorAll('[data-count]');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.count);
        const suffix = entry.target.dataset.suffix || '';
        animateValue(entry.target, 0, target, 2000, suffix);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statCounters.forEach(counter => countObserver.observe(counter));

  // --- PARALLAX EFFECT ON HERO ---
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const heroContent = heroSection.querySelector('.hero__content');
      if (heroContent && scrolled < 800) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled / 800);
      }
    });
  }

  // --- MAGNETIC BUTTON EFFECT ---
  const magneticButtons = document.querySelectorAll('.btn--primary, .cta-button, .sticky-cta__btn');

  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });

  // --- CURSOR GLOW ON CARDS ---
  const glowCards = document.querySelectorAll('.feature-card, .service-card, .pricing-card');

  glowCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // --- TYPING EFFECT FOR HEADLINES ---
  const typingElements = document.querySelectorAll('[data-typing]');

  typingElements.forEach(el => {
    const text = el.textContent;
    el.textContent = '';
    el.style.borderRight = '2px solid var(--color-primary)';

    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(typeInterval);
        el.style.borderRight = 'none';
      }
    }, 50);
  });

  // --- URGENCY COUNTDOWN TIMER ---
  function createCountdown() {
    const countdownEl = document.querySelector('.countdown-timer');
    if (!countdownEl) return;

    // Set end time to end of current month
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    function updateCountdown() {
      const now = new Date().getTime();
      const distance = endOfMonth - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      countdownEl.innerHTML = `
        <span class="countdown-item"><strong>${days}</strong>d</span>
        <span class="countdown-item"><strong>${hours}</strong>h</span>
        <span class="countdown-item"><strong>${minutes}</strong>m</span>
        <span class="countdown-item"><strong>${seconds}</strong>s</span>
      `;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  createCountdown();

  // --- FOCUS TRAP ON MODALS ---
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Close any open modals or toasts
      document.querySelectorAll('.social-proof-toast.visible').forEach(toast => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 300);
      });
    }
  });

  // --- CONFETTI ON CTA CLICK ---
  function createConfetti() {
    const colors = ['#0A7558', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}vw;
        top: -10px;
        opacity: 1;
        pointer-events: none;
        z-index: 10000;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        animation: confetti-fall ${2 + Math.random() * 2}s linear forwards;
      `;
      document.body.appendChild(confetti);

      setTimeout(() => confetti.remove(), 4000);
    }
  }

  // Add confetti animation
  const confettiStyle = document.createElement('style');
  confettiStyle.textContent = `
    @keyframes confetti-fall {
      0% { transform: translateY(0) rotate(0deg); opacity: 1; }
      100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }
  `;
  document.head.appendChild(confettiStyle);

  // Trigger confetti on main CTA clicks
  document.querySelectorAll('.hero .btn--primary, .cta-section .btn--primary').forEach(btn => {
    btn.addEventListener('click', createConfetti);
  });

})();
