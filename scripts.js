(function() {
  'use strict';

  // ------------------------------------------------------------
  // 1. Utility Helpers
  // ------------------------------------------------------------
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const on = (el, ev, fn) => el.addEventListener(ev, fn);

  // ------------------------------------------------------------
  // 2. Footer Year
  // ------------------------------------------------------------
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ------------------------------------------------------------
  // 3. Mobile Menu — slide + fade
  // ------------------------------------------------------------
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const navLinks = $$('.mobile-nav-link');

  if (menuBtn && mobileMenu) {
    let isOpen = false;

    const openMenu = () => {
      isOpen = true;
      menuBtn.setAttribute('aria-expanded', 'true');
      mobileMenu.classList.remove('hidden');
      // Trigger reflow for transition
      void mobileMenu.offsetWidth;
      mobileMenu.style.opacity = '1';
      mobileMenu.style.transform = 'translateY(0)';
      if (hamburgerIcon) {
        hamburgerIcon.style.transform = 'rotate(90deg)';
      }
    };

    const closeMenu = () => {
      isOpen = false;
      menuBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.style.opacity = '0';
      mobileMenu.style.transform = 'translateY(-8px)';
      if (hamburgerIcon) {
        hamburgerIcon.style.transform = 'rotate(0deg)';
      }
      setTimeout(() => {
        if (!isOpen) mobileMenu.classList.add('hidden');
      }, 300);
    };

    // Init styles
    mobileMenu.style.opacity = '0';
    mobileMenu.style.transform = 'translateY(-8px)';
    mobileMenu.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

    on(menuBtn, 'click', () => {
      if (isOpen) closeMenu();
      else openMenu();
    });

    navLinks.forEach(link => {
      on(link, 'click', closeMenu);
    });

    // Close on outside click
    on(document, 'click', (e) => {
      if (isOpen && !mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
        closeMenu();
      }
    });
  }

  // ------------------------------------------------------------
  // 4. Tab Switching — smooth fade
  // ------------------------------------------------------------
  const tabSend = document.getElementById('tab-send');
  const tabRide = document.getElementById('tab-ride');
  const parcelContainer = document.getElementById('parcel-type-container');
  let activeMode = 'parcel';

  const setActiveTab = (active) => {
    [tabSend, tabRide].forEach(t => {
      const isActive = t === active;
      t.setAttribute('aria-selected', isActive);
      t.className = isActive ?
        'flex-1 py-3 rounded-lg font-medium transition-all text-xs sm:text-sm bg-zinc-900 text-white shadow-sm focus:outline-none focus:ring-1 focus:ring-brandLime-500' :
        'flex-1 py-3 rounded-lg font-medium transition-all text-xs sm:text-sm text-zinc-500 hover:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-brandLime-500';
    });
  };

  if (tabSend && tabRide) {
    on(tabSend, 'click', () => {
      activeMode = 'parcel';
      setActiveTab(tabSend);
      if (parcelContainer) {
        parcelContainer.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        parcelContainer.style.opacity = '0';
        parcelContainer.style.transform = 'scale(0.98)';
        parcelContainer.classList.remove('hidden');
        void parcelContainer.offsetWidth;
        parcelContainer.style.opacity = '1';
        parcelContainer.style.transform = 'scale(1)';
      }
    });

    on(tabRide, 'click', () => {
      activeMode = 'ride';
      setActiveTab(tabRide);
      if (parcelContainer) {
        parcelContainer.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        parcelContainer.style.opacity = '0';
        parcelContainer.style.transform = 'scale(0.98)';
        setTimeout(() => {
          parcelContainer.classList.add('hidden');
          parcelContainer.style.opacity = '1';
          parcelContainer.style.transform = 'scale(1)';
        }, 200);
      }
    });
  }

  // ------------------------------------------------------------
  // 5. Form Submission — WhatsApp with validation feedback
  // ------------------------------------------------------------
  const bookingForm = document.getElementById('booking-form');
  const feedbackEl = document.getElementById('form-feedback');
  const pickupInput = document.getElementById('input-pickup');
  const dropoffInput = document.getElementById('input-dropoff');
  const notesInput = document.getElementById('input-notes');
  const packageSelect = document.getElementById('input-package-type');

  if (bookingForm) {
    // Real-time validation styling
    const validateField = (input) => {
      if (!input.value.trim()) {
        input.style.borderColor = '#ef4444';
        input.style.boxShadow = '0 0 0 1px #ef4444';
        return false;
      } else {
        input.style.borderColor = '#84cc16';
        input.style.boxShadow = '0 0 0 1px #84cc16';
        return true;
      }
    };

    const resetFieldStyle = (input) => {
      input.style.borderColor = '#27272a';
      input.style.boxShadow = 'none';
    };

    [pickupInput, dropoffInput].forEach(inp => {
      on(inp, 'blur', () => {
        if (inp.value.trim()) validateField(inp);
        else resetFieldStyle(inp);
      });
      on(inp, 'input', () => {
        if (inp.value.trim()) {
          inp.style.borderColor = '#84cc16';
          inp.style.boxShadow = '0 0 0 1px #84cc16';
        } else {
          resetFieldStyle(inp);
        }
      });
    });

    on(bookingForm, 'submit', (e) => {
      e.preventDefault();

      const pickup = pickupInput.value.trim();
      const dropoff = dropoffInput.value.trim();
      const notes = notesInput.value.trim();
      const pkg = packageSelect ? packageSelect.value : '';

      // Validate
      const isPickupValid = validateField(pickupInput);
      const isDropoffValid = validateField(dropoffInput);

      if (!isPickupValid || !isDropoffValid) {
        if (feedbackEl) {
          feedbackEl.textContent = '⚠️ Please fill in both pickup and drop-off locations.';
          feedbackEl.className = 'text-xs text-center text-red-400 block';
          feedbackEl.style.animation = 'none';
          void feedbackEl.offsetWidth;
          feedbackEl.style.animation = 'fadeIn 0.3s ease';
        }
        return;
      }

      // Build message
      let msg = '';
      if (activeMode === 'parcel') {
        msg =
          `Hello Marindany Logistics! 📦 I want to request a parcel delivery:\n\n📍 Pickup: ${pickup}\n🏁 Drop-off: ${dropoff}\n📦 Item: ${pkg}`;
      } else {
        msg =
          `Hello Marindany Logistics! 🏍️ I want to book a passenger ride:\n\n📍 Pickup: ${pickup}\n🏁 Destination: ${dropoff}`;
      }
      if (notes) msg += `\n📝 Note: ${notes}`;

      window.open(`https://wa.me/254725351381?text=${encodeURIComponent(msg)}`, '_blank');

      // Success feedback
      if (feedbackEl) {
        feedbackEl.textContent = '✅ WhatsApp opened! Your message is ready to send.';
        feedbackEl.className = 'text-xs text-center text-brandLime-400 block';
        feedbackEl.style.animation = 'none';
        void feedbackEl.offsetWidth;
        feedbackEl.style.animation = 'fadeIn 0.3s ease';
        setTimeout(() => {
          feedbackEl.textContent = '';
          feedbackEl.className = 'text-xs text-center text-brandLime-400 hidden';
        }, 4500);
      }

      // Reset validation styles
      resetFieldStyle(pickupInput);
      resetFieldStyle(dropoffInput);
    });
  }

  // ------------------------------------------------------------
  // 6. FAQ Accordion — premium height animation
  // ------------------------------------------------------------
  const faqItems = $$('.faq-item');

  faqItems.forEach(item => {
    const summary = item.querySelector('summary');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (!summary || !content) return;

    // Store natural height
    content.style.display = 'block';
    const naturalHeight = content.scrollHeight;
    content.style.display = '';
    content.style.height = '0';
    content.style.overflow = 'hidden';
    content.style.transition = 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease';
    content.style.opacity = '0';

    // Initially closed
    item.open = false;

    on(summary, 'click', (e) => {
      e.preventDefault();

      const isOpening = !item.open;

      // Close all others
      faqItems.forEach(other => {
        if (other !== item && other.open) {
          other.open = false;
          const otherContent = other.querySelector('.faq-content');
          const otherIcon = other.querySelector('.faq-icon');
          if (otherContent) {
            otherContent.style.height = '0';
            otherContent.style.opacity = '0';
          }
          if (otherIcon) {
            otherIcon.style.transform = 'rotate(0deg)';
          }
        }
      });

      if (isOpening) {
        item.open = true;
        content.style.height = naturalHeight + 'px';
        content.style.opacity = '1';
        if (icon) icon.style.transform = 'rotate(180deg)';
      } else {
        item.open = false;
        content.style.height = '0';
        content.style.opacity = '0';
        if (icon) icon.style.transform = 'rotate(0deg)';
      }
    });
  });

  // ------------------------------------------------------------
  // 7. Smooth Scroll for all anchor links (premium)
  // ------------------------------------------------------------
  $$('a[href^="#"]').forEach(anchor => {
    on(anchor, 'click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ------------------------------------------------------------
  // 8. Add fadeIn keyframes dynamically (clean)
  // ------------------------------------------------------------
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(6px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .faq-item[open] .faq-content {
        opacity: 1 !important;
      }
    `;
  document.head.appendChild(styleSheet);

  // ------------------------------------------------------------
  // 9. Performance: nav background on scroll
  // ------------------------------------------------------------
  const nav = document.querySelector('nav');
  let scrollTimeout;
  on(window, 'scroll', () => {
    if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
    scrollTimeout = requestAnimationFrame(() => {
      if (window.scrollY > 20) {
        nav.style.borderColor = '#3f3f46';
        nav.style.backdropFilter = 'blur(24px)';
      } else {
        nav.style.borderColor = '#27272a';
        nav.style.backdropFilter = 'blur(12px)';
      }
    });
  }, { passive: true });

  // ------------------------------------------------------------
  // 10. Tiny micro-interaction: button ripple effect (optional)
  // ------------------------------------------------------------
  $$('.bg-brandLime-500, .bg-white, .bg-brandGold-400').forEach(btn => {
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    on(btn, 'mousedown', function(e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.backgroundColor = 'rgba(255,255,255,0.2)';
      ripple.style.transform = 'scale(0)';
      ripple.style.animation = 'rippleAnim 0.6s ease-out forwards';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add ripple keyframes
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
      @keyframes rippleAnim {
        to { transform: scale(4); opacity: 0; }
      }
    `;
  document.head.appendChild(rippleStyle);

})();