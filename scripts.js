document.addEventListener('DOMContentLoaded', () => {
  // =============================================
  // PERFORMANCE: Inject animation keyframes
  // =============================================
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
      20%, 40%, 60%, 80% { transform: translateX(4px); }
    }
    
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeInScale {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    
    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 0 0 rgba(132, 204, 22, 0.4); }
      50% { box-shadow: 0 0 0 10px rgba(132, 204, 22, 0); }
    }
    
    @keyframes slideDown {
      from { max-height: 0; opacity: 0; transform: translateY(-10px); }
      to { max-height: 500px; opacity: 1; transform: translateY(0); }
    }
    
    @keyframes ripple {
      to { transform: scale(4); opacity: 0; }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-6px); }
    }
    
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    
    .animate-fade-in-up {
      animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;
    }
    
    .animate-fade-in-scale {
      animation: fadeInScale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    }
    
    .animate-float {
      animation: float 3s ease-in-out infinite;
    }
    
    .will-animate {
      will-change: transform, opacity;
    }
    
    .lazy-image {
      opacity: 0;
      transition: opacity 0.4s ease;
    }
    
    .lazy-image.loaded {
      opacity: 1;
    }
    
    /* Ripple effect */
    .ripple-container {
      position: relative;
      overflow: hidden;
    }
    
    .ripple-effect {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    }
    
    /* FAQ content animation */
    .faq-content-wrapper {
      overflow: hidden;
      transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
    }
    
    /* Stagger animations */
    .stagger-item {
      opacity: 0;
      transform: translateY(20px);
    }
    
    .stagger-item.visible {
      animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);

  // =============================================
  // REDUCED MOTION CHECK
  // =============================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Listen for changes
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    if (e.matches) {
      document.querySelectorAll('.will-animate, .stagger-item').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.animation = 'none';
      });
    }
  });

  // =============================================
  // 1. LAZY LOADING IMAGES
  // =============================================
  function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            
            // Add loaded class for fade-in effect
            img.classList.add('lazy-image');
            
            img.onload = () => {
              img.classList.add('loaded');
              img.style.transform = 'scale(1)';
            };
            
            img.onerror = () => {
              // Fallback for broken images
              img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="%2318181b"%3E%3Crect width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%2371717a" font-family="sans-serif"%3EImage Unavailable%3C/text%3E%3C/svg%3E';
              img.classList.add('loaded');
            };
            
            if (img.complete) {
              img.classList.add('loaded');
            }
            
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '100px 0px', // Start loading 100px before visible
        threshold: 0.01
      });
      
      lazyImages.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for browsers without IntersectionObserver
      lazyImages.forEach(img => {
        img.classList.add('loaded');
      });
    }
  }

  // =============================================
  // 2. DYNAMIC BUTTON ANIMATIONS
  // =============================================
  function initButtonAnimations() {
    const buttons = document.querySelectorAll('button, a[role="button"], .btn, a.bg-brandLime-500, a.bg-brandGold-400, a.bg-white');
    
    buttons.forEach(button => {
      // Skip if already processed or in mobile menu
      if (button.dataset.animated === 'true') return;
      button.dataset.animated = 'true';
      
      // Ripple effect
      button.classList.add('ripple-container');
      button.addEventListener('click', createRipple);
      
      // Hover animations
      button.addEventListener('mouseenter', () => {
        if (!prefersReducedMotion) {
          button.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, background-color 0.2s ease';
          button.style.transform = 'translateY(-2px)';
          button.style.boxShadow = '0 8px 25px rgba(132, 204, 22, 0.3)';
        }
      });
      
      button.addEventListener('mouseleave', () => {
        if (!prefersReducedMotion) {
          button.style.transform = 'translateY(0)';
          button.style.boxShadow = '';
        }
      });
      
      // Active/press animation
      button.addEventListener('mousedown', () => {
        if (!prefersReducedMotion) {
          button.style.transform = 'scale(0.95)';
          button.style.transition = 'transform 0.1s ease';
        }
      });
      
      button.addEventListener('mouseup', () => {
        if (!prefersReducedMotion) {
          button.style.transform = 'translateY(-2px)';
          button.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
        }
      });
      
      // Subtle pulse for CTA buttons
      if (button.classList.contains('bg-brandLime-500') || 
          button.classList.contains('bg-brandGold-400')) {
        button.style.animation = 'pulse-glow 2s infinite';
        button.addEventListener('mouseenter', () => {
          button.style.animation = 'none';
        });
        button.addEventListener('mouseleave', () => {
          setTimeout(() => {
            button.style.animation = 'pulse-glow 2s infinite';
          }, 1000);
        });
      }
    });
  }

  function createRipple(event) {
    const button = event.currentTarget;
    
    if (prefersReducedMotion) return;
    
    // Remove existing ripples
    const existingRipple = button.querySelector('.ripple-effect');
    if (existingRipple) existingRipple.remove();
    
    const ripple = document.createElement('span');
    ripple.classList.add('ripple-effect');
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    button.appendChild(ripple);
    
    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  }

  // =============================================
  // 3. FAQ ACCORDION WITH SMOOTH ANIMATIONS
  // =============================================
  function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
      const summary = item.querySelector('summary');
      const content = item.querySelector('.faq-content, div:not(summary)');
      const icon = item.querySelector('.faq-icon');
      
      if (!summary || !content) return;
      
      // Wrap content for animation
      if (!content.classList.contains('faq-content-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('faq-content-wrapper');
        wrapper.style.maxHeight = '0px';
        wrapper.style.opacity = '0';
        content.parentNode.insertBefore(wrapper, content);
        wrapper.appendChild(content);
      }
      
      const wrapper = content.parentElement.classList.contains('faq-content-wrapper') 
        ? content.parentElement 
        : content;
      
      // Initialize closed state
      if (!item.hasAttribute('open')) {
        wrapper.style.maxHeight = '0px';
        wrapper.style.opacity = '0';
      } else {
        wrapper.style.maxHeight = `${content.scrollHeight + 20}px`;
        wrapper.style.opacity = '1';
      }
      
      summary.addEventListener('click', (e) => {
        e.preventDefault();
        
        const isOpen = item.hasAttribute('open');
        
        // Close all other FAQs (accordion pattern)
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.hasAttribute('open')) {
            const otherSummary = otherItem.querySelector('summary');
            const otherWrapper = otherItem.querySelector('.faq-content-wrapper');
            const otherIcon = otherItem.querySelector('.faq-icon');
            
            otherItem.removeAttribute('open');
            if (otherWrapper) {
              otherWrapper.style.maxHeight = '0px';
              otherWrapper.style.opacity = '0';
            }
            if (otherIcon) {
              otherIcon.style.transform = 'rotate(0deg)';
            }
          }
        });
        
        // Toggle current FAQ
        if (isOpen) {
          item.removeAttribute('open');
          wrapper.style.maxHeight = '0px';
          wrapper.style.opacity = '0';
          if (icon) icon.style.transform = 'rotate(0deg)';
        } else {
          item.setAttribute('open', '');
          wrapper.style.maxHeight = `${content.scrollHeight + 20}px`;
          wrapper.style.opacity = '1';
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
      });
      
      // Icon animations
      if (icon) {
        icon.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        icon.style.display = 'inline-block';
      }
      
      // Add hover effect to summary
      summary.style.transition = 'color 0.2s ease';
      summary.addEventListener('mouseenter', () => {
        summary.style.color = '#a3e635';
      });
      summary.addEventListener('mouseleave', () => {
        summary.style.color = '';
      });
    });
  }

  // =============================================
  // 4. SMOOTH SCROLL OPTIMIZATION
  // =============================================
  function initSmoothScroll() {
    // Smooth scroll for anchor links with offset for fixed header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (!target) return;
        
        e.preventDefault();
        
        const headerHeight = 80; // Account for fixed header
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        if (prefersReducedMotion) {
          window.scrollTo(0, targetPosition);
        } else {
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
        
        // Update URL without jump
        history.pushState(null, null, targetId);
        
        // Add highlight effect to target section
        target.style.transition = 'box-shadow 0.6s ease';
        target.style.boxShadow = 'inset 0 0 0 2px rgba(132, 204, 22, 0.3)';
        setTimeout(() => {
          target.style.boxShadow = '';
        }, 1500);
      });
    });
    
    // Optimize scroll performance with passive event listener
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollEffects();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  function updateScrollEffects() {
    // Add shadow to header on scroll
    const header = document.querySelector('header nav');
    if (header) {
      if (window.scrollY > 10) {
        header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
      } else {
        header.style.boxShadow = '';
      }
    }
    
    // Highlight active section in navigation
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      if (window.pageYOffset >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.style.color = '#a3e635';
      }
    });
  }

  // =============================================
  // 5. STAGGER ANIMATIONS ON SCROLL
  // =============================================
  function initStaggerAnimations() {
    const staggerContainers = document.querySelectorAll('.grid');
    
    staggerContainers.forEach(container => {
      const items = container.children;
      Array.from(items).forEach((item, index) => {
        item.classList.add('stagger-item');
        item.style.transitionDelay = `${index * 0.1}s`;
      });
    });
    
    if ('IntersectionObserver' in window && !prefersReducedMotion) {
      const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            staggerObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });
      
      document.querySelectorAll('.stagger-item').forEach(item => {
        staggerObserver.observe(item);
      });
    }
  }

  // =============================================
  // 6. IMAGE PARALLAX/HOVER EFFECTS
  // =============================================
  function initImageEffects() {
    const galleryImages = document.querySelectorAll('.group.relative.overflow-hidden img');
    
    galleryImages.forEach(img => {
      img.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      
      const container = img.closest('.group');
      if (container && !prefersReducedMotion) {
        container.addEventListener('mouseenter', () => {
          img.style.transform = 'scale(1.1)';
        });
        
        container.addEventListener('mouseleave', () => {
          img.style.transform = 'scale(1)';
        });
        
        // Subtle parallax on scroll
        window.addEventListener('scroll', () => {
          if (prefersReducedMotion) return;
          
          const rect = container.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          
          if (rect.top < windowHeight && rect.bottom > 0) {
            const speed = 0.05;
            const yPos = (rect.top - windowHeight) * speed;
            img.style.transform = `translateY(${yPos}px) scale(1.05)`;
          }
        }, { passive: true });
      }
    });
  }

  // =============================================
  // 7. MOBILE MENU WITH SMOOTH ANIMATIONS
  // =============================================
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const hamburgerIcon = document.getElementById('hamburger-icon');

  function toggleMobileMenu(forceClose = false) {
    if (!mobileMenu || !mobileBtn) return;
    
    const isHidden = forceClose ? true : !mobileMenu.classList.contains('hidden');
    const isExpanded = !isHidden;
    
    if (isHidden) {
      mobileMenu.classList.add('hidden');
      mobileMenu.style.opacity = '0';
      mobileMenu.style.transform = 'translateY(-10px)';
    } else {
      mobileMenu.classList.remove('hidden');
      requestAnimationFrame(() => {
        mobileMenu.style.opacity = '1';
        mobileMenu.style.transform = 'translateY(0)';
      });
    }
    
    mobileBtn.setAttribute('aria-expanded', isExpanded);
    
    // Animate hamburger
    if (hamburgerIcon && !prefersReducedMotion) {
      hamburgerIcon.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      hamburgerIcon.style.transform = isExpanded ? 'rotate(90deg)' : 'rotate(0deg)';
    }
    
    // Focus trap
    if (isExpanded) {
      trapFocus(mobileMenu);
      document.addEventListener('keydown', handleEscKey);
    } else {
      document.removeEventListener('keydown', handleEscKey);
      setTimeout(() => mobileBtn.focus(), 100);
    }
  }

  function handleEscKey(e) {
    if (e.key === 'Escape') toggleMobileMenu(true);
  }

  if (mobileBtn && mobileMenu) {
    mobileMenu.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    mobileMenu.style.opacity = '0';
    mobileMenu.style.transform = 'translateY(-10px)';
    
    mobileBtn.addEventListener('click', () => toggleMobileMenu());
    
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => toggleMobileMenu(true));
    });
    
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
  // 8. FORM INTERACTIONS
  // =============================================
  const bookingForm = document.getElementById('booking-form');
  
  if (bookingForm) {
    const submitBtn = document.getElementById('submit-btn');
    const feedback = document.getElementById('form-feedback');
    const inputs = bookingForm.querySelectorAll('input, select, textarea');
    
    // Floating label effect
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.parentElement.querySelector('label').style.color = '#a3e635';
        input.parentElement.querySelector('label').style.transform = 'translateY(-2px)';
      });
      
      input.addEventListener('blur', () => {
        input.parentElement.querySelector('label').style.color = '';
        input.parentElement.querySelector('label').style.transform = '';
      });
      
      // Add transition to labels
      const label = input.parentElement.querySelector('label');
      if (label) {
        label.style.transition = 'color 0.2s ease, transform 0.2s ease';
      }
    });
    
    // Loading animation on submit
    if (submitBtn) {
      bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate
        const pickup = document.getElementById('input-pickup')?.value.trim();
        const dropoff = document.getElementById('input-dropoff')?.value.trim();
        
        if (!pickup || !dropoff) {
          if (feedback) showFeedback(feedback, 'Please fill in all required fields', 'error');
          return;
        }
        
        // Loading state
        const originalContent = submitBtn.innerHTML;
        submitBtn.innerHTML = `
          <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Opening WhatsApp...</span>
        `;
        submitBtn.disabled = true;
        
        // Submit after short delay for UX
        setTimeout(() => {
          const formData = new FormData(bookingForm);
          const message = buildWhatsAppMessage(formData);
          const waUrl = `https://wa.me/254725351381?text=${encodeURIComponent(message)}`;
          
          window.open(waUrl, '_blank', 'noopener,noreferrer');
          
          // Reset button
          setTimeout(() => {
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
          }, 1000);
        }, 800);
      });
    }
  }

  function buildWhatsAppMessage(formData) {
    const pickup = formData.get('pickup') || document.getElementById('input-pickup')?.value;
    const dropoff = document.getElementById('input-dropoff')?.value;
    const packageType = document.getElementById('input-package-type')?.value;
    const notes = document.getElementById('input-notes')?.value;
    const bookingMode = document.getElementById('parcel-type-container')?.style.display !== 'none' ? 'parcel' : 'ride';
    
    if (bookingMode === 'parcel') {
      return `Hello Marindany Logistics! I want to dispatch a parcel.\n\n📦 Pickup: ${pickup}\n🏁 Destination: ${dropoff}\n📋 Item: ${packageType}${notes ? `\n📝 Notes: ${notes}` : ''}`;
    } else {
      return `Hello Marindany Logistics! I need a passenger boda ride.\n\n📍 Pickup: ${pickup}\n🏁 Destination: ${dropoff}${notes ? `\n📝 Notes: ${notes}` : ''}`;
    }
  }

  // =============================================
  // UTILITY FUNCTIONS
  // =============================================
  function showFeedback(element, message, type = 'info') {
    if (!element) return;
    
    element.textContent = message;
    element.classList.remove('hidden');
    
    const colors = {
      error: '#ef4444',
      success: '#84cc16',
      info: '#a3e635'
    };
    
    element.style.color = colors[type] || colors.info;
    element.style.animation = 'fadeInUp 0.3s ease';
    
    if (type === 'success') {
      setTimeout(() => {
        element.style.opacity = '0';
        setTimeout(() => element.classList.add('hidden'), 300);
      }, 3000);
    }
  }

  function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
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

  // =============================================
  // INITIALIZE EVERYTHING
  // =============================================
  initLazyLoading();
  initButtonAnimations();
  initFAQAccordion();
  initSmoothScroll();
  initStaggerAnimations();
  initImageEffects();
  
  // Dynamic year
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  
  // Re-initialize button animations when DOM changes
  const observer = new MutationObserver(() => {
    initButtonAnimations();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});