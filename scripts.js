document.addEventListener('DOMContentLoaded', () => {
  // =============================================
  // MOBILE MENU TOGGLE (Enhanced)
  // =============================================
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const hamburgerIcon = document.getElementById('hamburger-icon');

  function toggleMobileMenu(forceClose = false) {
    if (!mobileMenu || !mobileBtn) return;
    
    const isHidden = forceClose ? true : mobileMenu.classList.toggle('hidden');
    const isExpanded = !isHidden;
    
    mobileBtn.setAttribute('aria-expanded', isExpanded);
    
    // Animate hamburger to X
    if (hamburgerIcon) {
      hamburgerIcon.style.transform = isExpanded ? 'rotate(90deg)' : 'rotate(0deg)';
      hamburgerIcon.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    }
    
    // Trap focus inside mobile menu when open
    if (isExpanded) {
      trapFocus(mobileMenu);
      // Close on Escape key
      document.addEventListener('keydown', handleMobileEscKey);
    } else {
      document.removeEventListener('keydown', handleMobileEscKey);
      mobileBtn.focus(); // Return focus to toggle button
    }
  }

  function handleMobileEscKey(e) {
    if (e.key === 'Escape') toggleMobileMenu(true);
  }

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => toggleMobileMenu());

    // Close menu when clicking navigation links
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => toggleMobileMenu(true));
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileMenu.classList.contains('hidden') && 
          !mobileMenu.contains(e.target) && 
          e.target !== mobileBtn &&
          !mobileBtn.contains(e.target)) {
        toggleMobileMenu(true);
      }
    });
  }

  // =============================================
  // BOOKING MODE TAB SWITCHER (Accessibility + Animation)
  // =============================================
  const tabSend = document.getElementById('tab-send');
  const tabRide = document.getElementById('tab-ride');
  const parcelContainer = document.getElementById('parcel-type-container');
  let bookingMode = 'parcel';

  function switchTab(mode) {
    bookingMode = mode;
    const isParcel = mode === 'parcel';

    // Update ARIA states
    tabSend.setAttribute('aria-pressed', isParcel);
    tabRide.setAttribute('aria-pressed', !isParcel);

    // Update visual states
    tabSend.className = isParcel 
      ? 'flex-1 py-3 rounded-lg font-medium transition-all duration-300 text-xs sm:text-sm bg-zinc-900 text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brandLime-500'
      : 'flex-1 py-3 rounded-lg font-medium transition-all duration-300 text-xs sm:text-sm text-zinc-500 hover:text-zinc-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brandLime-500';
    
    tabRide.className = !isParcel
      ? 'flex-1 py-3 rounded-lg font-medium transition-all duration-300 text-xs sm:text-sm bg-zinc-900 text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brandLime-500'
      : 'flex-1 py-3 rounded-lg font-medium transition-all duration-300 text-xs sm:text-sm text-zinc-500 hover:text-zinc-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brandLime-500';

    // Animate parcel container
    if (parcelContainer) {
      if (isParcel) {
        parcelContainer.style.display = 'block';
        requestAnimationFrame(() => {
          parcelContainer.style.opacity = '1';
          parcelContainer.style.transform = 'translateY(0)';
          parcelContainer.style.maxHeight = '200px';
        });
      } else {
        parcelContainer.style.opacity = '0';
        parcelContainer.style.transform = 'translateY(-10px)';
        parcelContainer.style.maxHeight = '0';
        setTimeout(() => {
          if (bookingMode === 'ride') {
            parcelContainer.style.display = 'none';
          }
        }, 300);
      }
    }
  }

  // Initialize parcel container with transition properties
  if (parcelContainer) {
    parcelContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease, max-height 0.3s ease';
    parcelContainer.style.overflow = 'hidden';
    parcelContainer.style.maxHeight = '200px';
  }

  if (tabSend && tabRide) {
    tabSend.addEventListener('click', () => switchTab('parcel'));
    tabRide.addEventListener('click', () => switchTab('ride'));

    // Keyboard navigation for tabs
    const tabContainer = tabSend.parentElement;
    if (tabContainer) {
      tabContainer.addEventListener('keydown', (e) => {
        const tabs = [tabSend, tabRide];
        const currentIndex = tabs.indexOf(document.activeElement);
        
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          const nextIndex = e.key === 'ArrowRight' 
            ? (currentIndex + 1) % tabs.length 
            : (currentIndex - 1 + tabs.length) % tabs.length;
          tabs[nextIndex].focus();
        }
      });
    }
  }

  // =============================================
  // WHATSAPP BOOKING FORM (Enhanced Validation + Animations)
  // =============================================
  const bookingForm = document.getElementById('booking-form');
  
  if (bookingForm) {
    const pickupInput = document.getElementById('input-pickup');
    const dropoffInput = document.getElementById('input-dropoff');
    const feedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('submit-btn');

    // Real-time validation with animations
    [pickupInput, dropoffInput].forEach(input => {
      if (!input) return;
      
      input.addEventListener('input', () => {
        if (input.value.trim()) {
          input.style.borderColor = '#84cc16';
          input.style.boxShadow = '0 0 0 1px rgba(132, 204, 22, 0.3)';
        } else {
          input.style.borderColor = '';
          input.style.boxShadow = '';
        }
        // Clear feedback when user starts typing
        if (feedback && !feedback.classList.contains('hidden')) {
          hideFeedback(feedback);
        }
      });

      input.addEventListener('blur', () => {
        input.style.borderColor = '';
        input.style.boxShadow = '';
      });
    });

    // Form submission
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const pickup = pickupInput?.value.trim() || '';
      const dropoff = dropoffInput?.value.trim() || '';
      const packageType = document.getElementById('input-package-type')?.value || '';
      const notes = document.getElementById('input-notes')?.value.trim() || '';

      // Validate with shake animation on empty fields
      let hasError = false;
      
      if (!pickup) {
        animateShake(pickupInput);
        hasError = true;
      }
      if (!dropoff) {
        animateShake(dropoffInput);
        hasError = true;
      }

      if (hasError) {
        showFeedback(feedback, '⚠️ Please fill in both pickup location and destination.', 'error');
        return;
      }

      // Loading state
      if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Preparing WhatsApp...</span>';
        submitBtn.disabled = true;
        
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 2000);
      }

      // Build message
      let message = '';
      if (bookingMode === 'parcel') {
        message = `Hello Marindany Logistics! I want to dispatch a parcel.\n\n📦 *Pickup:* ${pickup}\n🏁 *Destination:* ${dropoff}\n📋 *Item:* ${packageType}`;
        if (notes) message += `\n📝 *Notes:* ${notes}`;
      } else {
        message = `Hello Marindany Logistics! I need a passenger boda ride.\n\n📍 *Pickup:* ${pickup}\n🏁 *Destination:* ${dropoff}`;
        if (notes) message += `\n📝 *Notes:* ${notes}`;
      }

      // Success feedback before redirect
      showFeedback(feedback, '✅ Opening WhatsApp...', 'success');
      
      // Small delay for user to see success message
      setTimeout(() => {
        const waUrl = `https://wa.me/254725351381?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      }, 500);
    });
  }

  // =============================================
  // FAQ ACCORDION (Enhanced Animation + Accessibility)
  // =============================================
  document.querySelectorAll('.faq-item').forEach(item => {
    const summary = item.querySelector('summary');
    const icon = item.querySelector('.faq-icon');
    
    if (!summary) return;

    summary.addEventListener('click', (e) => {
      // Close other open FAQs (accordion pattern)
      document.querySelectorAll('.faq-item[open]').forEach(openItem => {
        if (openItem !== item) {
          openItem.removeAttribute('open');
          const openIcon = openItem.querySelector('.faq-icon');
          if (openIcon) openIcon.style.transform = 'rotate(0deg)';
        }
      });
      
      // Animate icon
      if (icon) {
        const isOpen = item.hasAttribute('open');
        icon.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
      }
    });

    // Initialize icon transition
    if (icon) {
      icon.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    }
  });

  // =============================================
  // INTERSECTION OBSERVER (Scroll Animations)
  // =============================================
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.bg-black, .bg-zinc-950, .card, section');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      observer.observe(el);
    });
  };

  // Initialize scroll animations if user hasn't requested reduced motion
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animateOnScroll();
  }

  // =============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // =============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'start'
        });
        
        // Update URL without jump
        history.pushState(null, null, targetId);
      }
    });
  });

  // =============================================
  // DYNAMIC YEAR UPDATE
  // =============================================
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // =============================================
  // UTILITY FUNCTIONS
  // =============================================
  function showFeedback(element, message, type = 'info') {
    if (!element) return;
    
    element.textContent = message;
    element.classList.remove('hidden');
    
    // Color based on type
    const colors = {
      error: '#ef4444',
      success: '#84cc16',
      info: '#a3e635'
    };
    
    element.style.color = colors[type] || colors.info;
    element.style.animation = 'none';
    element.offsetHeight; // Trigger reflow
    element.style.animation = 'fadeIn 0.3s ease';
    
    // Auto-hide success messages
    if (type === 'success') {
      setTimeout(() => hideFeedback(element), 3000);
    }
  }

  function hideFeedback(element) {
    if (!element) return;
    element.style.opacity = '0';
    element.style.transform = 'translateY(-10px)';
    element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    setTimeout(() => {
      element.classList.add('hidden');
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, 300);
  }

  function animateShake(element) {
    if (!element) return;
    
    element.style.animation = 'none';
    element.offsetHeight; // Trigger reflow
    element.style.animation = 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both';
    element.style.borderColor = '#ef4444';
    element.style.boxShadow = '0 0 0 1px rgba(239, 68, 68, 0.5)';
    
    setTimeout(() => {
      element.style.borderColor = '';
      element.style.boxShadow = '';
    }, 1500);
  }

  function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    // Focus first element
    firstFocusable.focus();
    
    element.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    });
  }
});

// =============================================
// ANIMATION KEYFRAMES (Injected via JS)
// =============================================
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
    20%, 40%, 60%, 80% { transform: translateX(4px); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes pulse-subtle {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
  
  .shake-animation {
    animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }
  
  .fade-in-animation {
    animation: fadeIn 0.3s ease;
  }
`;
document.head.appendChild(styleSheet);