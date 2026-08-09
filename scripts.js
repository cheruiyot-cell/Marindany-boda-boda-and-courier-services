/* =============================================
   MARINDANY LOGISTICS — INTERACTIVE SCRIPTS
   Production-ready, accessible, and performant
   ============================================= */

(function () {
  'use strict';

  // ============ DOM ELEMENTS ============
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const bookingForm = document.getElementById('booking-form');
  const formFeedback = document.getElementById('form-feedback');
  const tabSend = document.getElementById('tab-send');
  const tabRide = document.getElementById('tab-ride');
  const parcelTypeContainer = document.getElementById('parcel-type-container');
  const currentYearSpan = document.getElementById('current-year');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  // ============ STATE ============
  let isMenuOpen = false;
  let activeService = 'deliver'; // 'deliver' or 'ride'

  // ============ INITIALIZATION ============
  function init() {
    setCurrentYear();
    setupMobileMenu();
    setupServiceTabs();
    setupBookingForm();
    setupFAQAccordion();
    setupSmoothScroll();
    setupImageLazyLoading();
    addAccessibilityEnhancements();
  }

  // ============ SET CURRENT YEAR ============
  function setCurrentYear() {
    if (currentYearSpan) {
      currentYearSpan.textContent = new Date().getFullYear();
    }
  }

  // ============ MOBILE MENU ============
  function setupMobileMenu() {
    if (!mobileMenuBtn || !mobileMenu) return;

    // Toggle menu
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking nav links
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (isMenuOpen) {
          closeMobileMenu();
        }
      });
    });

    // Close menu when pressing Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMobileMenu();
        mobileMenuBtn.focus();
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (isMenuOpen && 
          !mobileMenu.contains(e.target) && 
          !mobileMenuBtn.contains(e.target)) {
        closeMobileMenu();
      }
    });
  }

  function toggleMobileMenu() {
    if (isMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function openMobileMenu() {
    mobileMenu.classList.remove('hidden');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    
    // Animate hamburger to X
    if (hamburgerIcon) {
      hamburgerIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';
    }
    
    isMenuOpen = true;
    
    // Trap focus within menu
    const firstFocusable = mobileMenu.querySelector('a');
    if (firstFocusable) {
      setTimeout(() => firstFocusable.focus(), 100);
    }
  }

  function closeMobileMenu() {
    mobileMenu.classList.add('hidden');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    
    // Restore hamburger icon
    if (hamburgerIcon) {
      hamburgerIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
    }
    
    isMenuOpen = false;
  }

  // ============ SERVICE TABS ============
  function setupServiceTabs() {
    if (!tabSend || !tabRide) return;

    tabSend.addEventListener('click', () => switchService('deliver'));
    tabRide.addEventListener('click', () => switchService('ride'));
  }

  function switchService(service) {
    activeService = service;
    
    if (service === 'deliver') {
      tabSend.setAttribute('aria-pressed', 'true');
      tabSend.classList.add('bg-zinc-900', 'text-white', 'shadow-sm');
      tabSend.classList.remove('text-zinc-500');
      
      tabRide.setAttribute('aria-pressed', 'false');
      tabRide.classList.remove('bg-zinc-900', 'text-white', 'shadow-sm');
      tabRide.classList.add('text-zinc-500');
      
      if (parcelTypeContainer) {
        parcelTypeContainer.style.display = 'block';
      }
      
      // Update button text
      const submitBtn = document.getElementById('submit-btn');
      if (submitBtn) {
        submitBtn.querySelector('span').textContent = 'Send Dispatch via WhatsApp';
      }
    } else {
      tabRide.setAttribute('aria-pressed', 'true');
      tabRide.classList.add('bg-zinc-900', 'text-white', 'shadow-sm');
      tabRide.classList.remove('text-zinc-500');
      
      tabSend.setAttribute('aria-pressed', 'false');
      tabSend.classList.remove('bg-zinc-900', 'text-white', 'shadow-sm');
      tabSend.classList.add('text-zinc-500');
      
      if (parcelTypeContainer) {
        parcelTypeContainer.style.display = 'none';
      }
      
      // Update button text
      const submitBtn = document.getElementById('submit-btn');
      if (submitBtn) {
        submitBtn.querySelector('span').textContent = 'Book Ride via WhatsApp';
      }
    }
  }

  // ============ BOOKING FORM ============
  function setupBookingForm() {
    if (!bookingForm) return;

    bookingForm.addEventListener('submit', handleFormSubmit);
    
    // Real-time validation on blur
    const inputs = bookingForm.querySelectorAll('input[required], select[required]');
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('border-red-500')) {
          validateField(input);
        }
      });
    });
  }

  function validateField(field) {
    if (field.value.trim() === '') {
      field.classList.add('border-red-500');
      field.classList.remove('border-zinc-800');
      return false;
    } else {
      field.classList.remove('border-red-500');
      field.classList.add('border-zinc-800');
      return true;
    }
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form fields
    const pickupInput = document.getElementById('input-pickup');
    const dropoffInput = document.getElementById('input-dropoff');
    const packageTypeSelect = document.getElementById('input-package-type');
    const urgencySelect = document.getElementById('input-urgency');
    const notesInput = document.getElementById('input-notes');
    
    // Validate required fields
    let isValid = true;
    
    if (!validateField(pickupInput)) isValid = false;
    if (!validateField(dropoffInput)) isValid = false;
    
    // Check if parcel type is visible and validate if so
    if (activeService === 'deliver' && packageTypeSelect) {
      if (!validateField(packageTypeSelect)) isValid = false;
    }
    
    if (!isValid) {
      showFeedback('Please fill in all required fields.', 'error');
      
      // Focus first invalid field
      const firstInvalid = bookingForm.querySelector('.border-red-500');
      if (firstInvalid) firstInvalid.focus();
      
      return;
    }
    
    // Build WhatsApp message
    const pickup = encodeURIComponent(pickupInput.value.trim());
    const dropoff = encodeURIComponent(dropoffInput.value.trim());
    const packageType = packageTypeSelect ? encodeURIComponent(packageTypeSelect.value) : '';
    const urgency = urgencySelect ? encodeURIComponent(urgencySelect.value) : 'Standard 🕐';
    const notes = notesInput.value.trim() ? encodeURIComponent(notesInput.value.trim()) : '';
    
    let whatsappMessage = '';
    
    if (activeService === 'deliver') {
      whatsappMessage = `Hello%20Marindany%20Logistics!%0A%0A📦%20*New%20Parcel%20Delivery%20Request*%0A%0A📍%20Pickup:%20${pickup}%0A📍%20Destination:%20${dropoff}%0A📋%20Item:%20${packageType}%0A⚡%20Priority:%20${urgency}`;
    } else {
      whatsappMessage = `Hello%20Marindany%20Logistics!%0A%0A🏍️%20*New%20Passenger%20Ride%20Request*%0A%0A📍%20Pickup:%20${pickup}%0A📍%20Destination:%20${dropoff}%0A⚡%20Priority:%20${urgency}`;
    }
    
    if (notes) {
      whatsappMessage += `%0A📝%20Notes:%20${notes}`;
    }
    
    whatsappMessage += `%0A%0A🙏%20Thank%20you!`;
    
    // Open WhatsApp
    const whatsappURL = `https://wa.me/254725351381?text=${whatsappMessage}`;
    
    showFeedback('Opening WhatsApp...', 'success');
    
    // Small delay for feedback visibility
    setTimeout(() => {
      window.open(whatsappURL, '_blank', 'noopener,noreferrer');
    }, 300);
    
    // Reset form after submission
    setTimeout(() => {
      bookingForm.reset();
      if (formFeedback) {
        formFeedback.classList.add('hidden');
      }
    }, 2000);
  }

  function showFeedback(message, type) {
    if (!formFeedback) return;
    
    formFeedback.textContent = message;
    formFeedback.className = 'text-xs text-center rounded-lg p-3';
    formFeedback.classList.add(type);
    formFeedback.classList.remove('hidden');
    
    // Auto-hide after 5 seconds
    clearTimeout(formFeedback.hideTimeout);
    formFeedback.hideTimeout = setTimeout(() => {
      formFeedback.classList.add('hidden');
    }, 5000);
  }

  // ============ FAQ ACCORDION ============
  function setupFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
      const summary = item.querySelector('summary');
      if (!summary) return;
      
      summary.addEventListener('click', (e) => {
        // Close other open items (accordion behavior)
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.hasAttribute('open')) {
            otherItem.removeAttribute('open');
          }
        });
      });
    });
  }

  // ============ SMOOTH SCROLL ============
  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        
        // Skip if it's just "#"
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          e.preventDefault();
          
          const headerHeight = document.querySelector('nav')?.offsetHeight || 80;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update URL without scrolling
          history.pushState(null, null, targetId);
          
          // Set focus to target for accessibility
          targetElement.setAttribute('tabindex', '-1');
          targetElement.focus({ preventScroll: true });
        }
      });
    });
  }

  // ============ IMAGE LAZY LOADING ============
  function setupImageLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
      // Browser supports native lazy loading - already handled in HTML
      return;
    }
    
    // Fallback for browsers that don't support native lazy loading
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            imageObserver.unobserve(img);
          }
        });
      });
      
      lazyImages.forEach(img => imageObserver.observe(img));
    }
  }

  // ============ ACCESSIBILITY ENHANCEMENTS ============
  function addAccessibilityEnhancements() {
    // Add skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-to-main';
    skipLink.textContent = 'Skip to main content';
    document.body.prepend(skipLink);
    
    // Add role="main" to main element if not present
    const mainElement = document.querySelector('main');
    if (mainElement && !mainElement.hasAttribute('role')) {
      mainElement.setAttribute('id', 'main-content');
    }
    
    // Ensure all external links have proper attributes
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
      if (!link.hasAttribute('rel')) {
        link.setAttribute('rel', 'noopener noreferrer');
      }
      
      if (!link.hasAttribute('aria-label')) {
        link.setAttribute('aria-label', link.textContent.trim() + ' (opens in new tab)');
      }
    });
  }

  // ============ ERROR HANDLING ============
  window.addEventListener('error', function(e) {
    console.error('Global error:', e.message);
    // In production, you would send this to an error tracking service
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
  });

  // ============ PERFORMANCE OBSERVER ============
  if ('PerformanceObserver' in window) {
    // Monitor for long tasks
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn('Long task detected:', entry.duration, 'ms');
          }
        }
      });
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      // longtask may not be supported
    }
  }

  // ============ START ============
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();