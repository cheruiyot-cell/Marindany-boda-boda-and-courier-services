// scripts.js - Fixed version with critical fixes

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

  // Calendar elements
  const calendarGrid = document.getElementById('calendar-grid');
  const calendarMonthYear = document.getElementById('calendar-month-year');
  const prevMonthBtn = document.getElementById('prev-month');
  const nextMonthBtn = document.getElementById('next-month');
  const timeSlotBtns = document.querySelectorAll('.time-slot-btn');
  const selectedDateDisplay = document.getElementById('selected-date-display');
  const scheduleBookingBtn = document.getElementById('schedule-booking-btn');
  const scheduleFeedback = document.getElementById('schedule-feedback');
  const scheduleServiceType = document.getElementById('schedule-service-type');

  // ============ STATE ============
  let isMenuOpen = false;
  let activeService = 'deliver'; // 'deliver' or 'ride'
  
  // Calendar state
  let currentDate = new Date();
  let selectedDate = null;
  let selectedTimeSlot = null;
  let focusableElements = [];
  let lastFocusedElement = null;

  // ============ INITIALIZATION ============
  function init() {
    setCurrentYear();
    setupMobileMenu();
    setupServiceTabs();
    setupBookingForm();
    setupCalendar();
    setupFAQAccordion();
    setupSmoothScroll();
    setupImageLazyLoading();
    setupCardHoverEffects();
    addAccessibilityEnhancements();
    preventZoomOnDoubleTap();
    setupKeyboardNavigation();
    fixCalendarAccessibility();
  }

  // ============ SET CURRENT YEAR ============
  function setCurrentYear() {
    if (currentYearSpan) {
      currentYearSpan.textContent = new Date().getFullYear();
    }
  }

  // ============ MOBILE MENU (FIXED) ============
  function setupMobileMenu() {
    if (!mobileMenuBtn || !mobileMenu) return;

    // Fix: Remove display:none from hidden state, use opacity and visibility instead
    mobileMenu.classList.add('menu-closed');
    mobileMenu.classList.remove('hidden');

    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (isMenuOpen) closeMobileMenu();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMobileMenu();
        mobileMenuBtn.focus();
      }
      
      // Focus trap inside mobile menu
      if (isMenuOpen && e.key === 'Tab') {
        trapFocus(e);
      }
    });

    document.addEventListener('click', (e) => {
      if (isMenuOpen && 
          !mobileMenu.contains(e.target) && 
          !mobileMenuBtn.contains(e.target)) {
        closeMobileMenu();
      }
    });
  }

  function toggleMobileMenu() {
    isMenuOpen ? closeMobileMenu() : openMobileMenu();
  }

  function openMobileMenu() {
    // Fix: Use visibility + opacity for smooth animation
    mobileMenu.classList.remove('menu-closed');
    mobileMenu.classList.add('menu-open');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    
    if (hamburgerIcon) {
      hamburgerIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';
    }
    
    isMenuOpen = true;
    
    // Store last focused element
    lastFocusedElement = document.activeElement;
    
    // Focus first focusable element
    const firstFocusable = mobileMenu.querySelector('a, button, input, select, textarea');
    if (firstFocusable) {
      setTimeout(() => firstFocusable.focus(), 100);
    }
  }

  function closeMobileMenu() {
    // Fix: Use visibility + opacity for smooth animation
    mobileMenu.classList.remove('menu-open');
    mobileMenu.classList.add('menu-closed');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    
    if (hamburgerIcon) {
      hamburgerIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
    }
    
    isMenuOpen = false;
    
    // Return focus to previous element
    if (lastFocusedElement) {
      setTimeout(() => lastFocusedElement.focus(), 100);
    }
  }

  // ============ FOCUS TRAP FOR MOBILE MENU ============
  function trapFocus(e) {
    const focusable = mobileMenu.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstFocusable = focusable[0];
    const lastFocusable = focusable[focusable.length - 1];
    
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
  }

  // ============ SERVICE TABS ============
  function setupServiceTabs() {
    if (!tabSend || !tabRide) return;

    tabSend.addEventListener('click', () => switchService('deliver'));
    tabRide.addEventListener('click', () => switchService('ride'));
    
    // Fix: Add keyboard support
    tabSend.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        switchService('deliver');
      }
    });
    
    tabRide.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        switchService('ride');
      }
    });
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
        parcelTypeContainer.style.opacity = '1';
        parcelTypeContainer.style.maxHeight = '200px';
        parcelTypeContainer.style.overflow = 'visible';
        parcelTypeContainer.style.transition = 'all 0.3s ease';
      }
      
      const submitBtn = document.getElementById('submit-btn');
      if (submitBtn) {
        const span = submitBtn.querySelector('span');
        if (span) span.textContent = 'Send Dispatch via WhatsApp';
      }
    } else {
      tabRide.setAttribute('aria-pressed', 'true');
      tabRide.classList.add('bg-zinc-900', 'text-white', 'shadow-sm');
      tabRide.classList.remove('text-zinc-500');
      
      tabSend.setAttribute('aria-pressed', 'false');
      tabSend.classList.remove('bg-zinc-900', 'text-white', 'shadow-sm');
      tabSend.classList.add('text-zinc-500');
      
      if (parcelTypeContainer) {
        parcelTypeContainer.style.opacity = '0';
        parcelTypeContainer.style.maxHeight = '0';
        parcelTypeContainer.style.overflow = 'hidden';
        parcelTypeContainer.style.transition = 'all 0.3s ease';
      }
      
      const submitBtn = document.getElementById('submit-btn');
      if (submitBtn) {
        const span = submitBtn.querySelector('span');
        if (span) span.textContent = 'Book Ride via WhatsApp';
      }
    }
  }

  // ============ BOOKING FORM (FIXED) ============
  function setupBookingForm() {
    if (!bookingForm) return;

    bookingForm.addEventListener('submit', handleFormSubmit);
    
    const inputs = bookingForm.querySelectorAll('input[required], select[required]');
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('border-red-500')) validateField(input);
      });
    });
  }

  function validateField(field) {
    if (!field) return false;
    
    if (field.value.trim() === '') {
      field.classList.add('border-red-500');
      field.classList.remove('border-zinc-800');
      
      // Add error message for accessibility
      const errorId = `${field.id}-error`;
      let errorMsg = document.getElementById(errorId);
      if (!errorMsg) {
        errorMsg = document.createElement('div');
        errorMsg.id = errorId;
        errorMsg.className = 'text-red-500 text-sm mt-1';
        errorMsg.setAttribute('role', 'alert');
        field.parentNode.appendChild(errorMsg);
      }
      errorMsg.textContent = 'This field is required';
      field.setAttribute('aria-describedby', errorId);
      field.setAttribute('aria-invalid', 'true');
      
      return false;
    } else {
      field.classList.remove('border-red-500');
      field.classList.add('border-zinc-800');
      
      const errorId = `${field.id}-error`;
      const errorMsg = document.getElementById(errorId);
      if (errorMsg) {
        errorMsg.textContent = '';
        errorMsg.setAttribute('role', '');
      }
      field.removeAttribute('aria-invalid');
      field.removeAttribute('aria-describedby');
      
      return true;
    }
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    
    const pickupInput = document.getElementById('input-pickup');
    const dropoffInput = document.getElementById('input-dropoff');
    const packageTypeSelect = document.getElementById('input-package-type');
    const urgencySelect = document.getElementById('input-urgency');
    const notesInput = document.getElementById('input-notes');
    
    let isValid = true;
    
    if (!validateField(pickupInput)) isValid = false;
    if (!validateField(dropoffInput)) isValid = false;
    
    if (activeService === 'deliver' && packageTypeSelect) {
      if (!validateField(packageTypeSelect)) isValid = false;
    }
    
    if (!isValid) {
      showFeedback('Please fill in all required fields.', 'error');
      
      const firstInvalid = bookingForm.querySelector('.border-red-500');
      if (firstInvalid) firstInvalid.focus();
      
      return;
    }
    
    const pickup = encodeURIComponent(pickupInput.value.trim());
    const dropoff = encodeURIComponent(dropoffInput.value.trim());
    const packageType = packageTypeSelect ? encodeURIComponent(packageTypeSelect.value) : '';
    const urgency = urgencySelect ? encodeURIComponent(urgencySelect.value) : 'Standard 🕐';
    const notes = notesInput && notesInput.value.trim() ? encodeURIComponent(notesInput.value.trim()) : '';
    
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
    
    const whatsappURL = `https://wa.me/254725351381?text=${whatsappMessage}`;
    
    showFeedback('Opening WhatsApp...', 'success');
    
    setTimeout(() => {
      window.open(whatsappURL, '_blank', 'noopener,noreferrer');
    }, 300);
    
    setTimeout(() => {
      bookingForm.reset();
      if (formFeedback) formFeedback.classList.add('hidden');
      // Reset validation states
      bookingForm.querySelectorAll('.border-red-500').forEach(el => {
        el.classList.remove('border-red-500');
        el.classList.add('border-zinc-800');
      });
    }, 2000);
  }

  function showFeedback(message, type) {
    if (!formFeedback) return;
    
    formFeedback.textContent = message;
    formFeedback.className = 'text-sm text-center rounded-lg p-3';
    formFeedback.classList.add(type === 'error' ? 'bg-red-900/50 text-red-400' : 'bg-green-900/50 text-green-400');
    formFeedback.classList.remove('hidden');
    formFeedback.setAttribute('role', 'alert');
    
    clearTimeout(formFeedback._hideTimeout);
    formFeedback._hideTimeout = setTimeout(() => {
      formFeedback.classList.add('hidden');
      formFeedback.setAttribute('role', '');
    }, 5000);
  }

  // ============ CALENDAR SYSTEM (FIXED ACCESSIBILITY) ============
  function setupCalendar() {
    if (!calendarGrid || !calendarMonthYear) return;
    
    renderCalendar();
    
    if (prevMonthBtn) {
      prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
      });
    }
    
    if (nextMonthBtn) {
      nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
      });
    }
    
    timeSlotBtns.forEach(btn => {
      btn.addEventListener('click', () => selectTimeSlot(btn));
    });
    
    if (scheduleBookingBtn) {
      scheduleBookingBtn.addEventListener('click', handleScheduleBooking);
    }
  }

  function fixCalendarAccessibility() {
    // Ensure calendar days have proper roles
    const days = calendarGrid.querySelectorAll('.calendar-day:not(.empty)');
    days.forEach(day => {
      day.setAttribute('role', 'button');
      day.setAttribute('tabindex', '0');
    });
  }

  function renderCalendar() {
    if (!calendarGrid || !calendarMonthYear) return;
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    calendarMonthYear.textContent = `${monthNames[month]} ${year}`;
    
    const firstDay = new Date(year, month, 1).getDay();
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let calendarHTML = '';
    
    for (let i = 0; i < adjustedFirstDay; i++) {
      calendarHTML += '<div class="calendar-day empty" role="presentation"></div>';
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);
      
      const isToday = date.getTime() === today.getTime();
      const isPast = date < today;
      const isUnavailable = isPast;
      
      const isSelected = selectedDate && 
                         date.getFullYear() === selectedDate.getFullYear() &&
                         date.getMonth() === selectedDate.getMonth() &&
                         date.getDate() === selectedDate.getDate();
      
      let dayClass = 'calendar-day';
      if (isToday) dayClass += ' today';
      if (isUnavailable) dayClass += ' unavailable';
      if (isSelected) dayClass += ' selected';
      
      const ariaLabel = `${monthNames[month]} ${day}, ${year}${isUnavailable ? ' (unavailable)' : ''}`;
      
      calendarHTML += `
        <button 
          class="${dayClass}"
          data-date="${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}"
          ${isUnavailable ? 'disabled aria-disabled="true"' : ''}
          aria-label="${ariaLabel}"
          role="gridcell"
          tabindex="${isUnavailable ? '-1' : '0'}"
          ${isToday ? 'aria-current="date"' : ''}
        >
          ${day}
        </button>
      `;
    }
    
    calendarGrid.innerHTML = calendarHTML;
    
    // Fix: Add keyboard navigation
    calendarGrid.querySelectorAll('.calendar-day:not(.empty):not(.unavailable)').forEach(dayBtn => {
      dayBtn.addEventListener('click', () => selectDate(dayBtn));
      dayBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectDate(dayBtn);
        }
      });
    });
    
    // Add arrow key navigation
    setupCalendarKeyboardNavigation();
  }

  function setupCalendarKeyboardNavigation() {
    const days = calendarGrid.querySelectorAll('.calendar-day:not(.empty):not(.unavailable)');
    days.forEach((day, index) => {
      day.addEventListener('keydown', (e) => {
        let targetIndex = -1;
        
        switch(e.key) {
          case 'ArrowRight':
            targetIndex = index + 1;
            break;
          case 'ArrowLeft':
            targetIndex = index - 1;
            break;
          case 'ArrowDown':
            targetIndex = index + 7;
            break;
          case 'ArrowUp':
            targetIndex = index - 7;
            break;
        }
        
        if (targetIndex >= 0 && targetIndex < days.length) {
          e.preventDefault();
          days[targetIndex].focus();
        }
      });
    });
  }

  function selectDate(dayBtn) {
    calendarGrid.querySelectorAll('.calendar-day.selected').forEach(btn => {
      btn.classList.remove('selected');
    });
    
    dayBtn.classList.add('selected');
    const dateStr = dayBtn.getAttribute('data-date');
    selectedDate = new Date(dateStr + 'T00:00:00');
    
    if (selectedDateDisplay) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      selectedDateDisplay.textContent = `📅 ${selectedDate.toLocaleDateString('en-US', options)}`;
    }
    
    timeSlotBtns.forEach(btn => {
      btn.disabled = false;
      btn.classList.remove('opacity-50', 'cursor-not-allowed');
      btn.setAttribute('aria-disabled', 'false');
    });
    
    selectedTimeSlot = null;
    timeSlotBtns.forEach(b => {
      b.classList.remove('bg-brandGold-400', 'text-black', 'border-brandGold-400');
      b.classList.add('bg-zinc-900', 'text-white', 'border-zinc-800');
      b.removeAttribute('aria-selected');
    });
    updateScheduleButton();
  }

  function selectTimeSlot(btn) {
    if (!selectedDate) return;
    
    timeSlotBtns.forEach(b => {
      b.classList.remove('bg-brandGold-400', 'text-black', 'border-brandGold-400');
      b.classList.add('bg-zinc-900', 'text-white', 'border-zinc-800');
      b.removeAttribute('aria-selected');
    });
    
    btn.classList.remove('bg-zinc-900', 'text-white', 'border-zinc-800');
    btn.classList.add('bg-brandGold-400', 'text-black', 'border-brandGold-400');
    btn.setAttribute('aria-selected', 'true');
    selectedTimeSlot = btn.getAttribute('data-time');
    
    updateScheduleButton();
  }

  function updateScheduleButton() {
    if (scheduleBookingBtn) {
      if (selectedDate && selectedTimeSlot) {
        scheduleBookingBtn.disabled = false;
        scheduleBookingBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        scheduleBookingBtn.setAttribute('aria-disabled', 'false');
      } else {
        scheduleBookingBtn.disabled = true;
        scheduleBookingBtn.classList.add('opacity-50', 'cursor-not-allowed');
        scheduleBookingBtn.setAttribute('aria-disabled', 'true');
      }
    }
  }

  function handleScheduleBooking() {
    if (!selectedDate || !selectedTimeSlot || !scheduleFeedback) return;
    
    const serviceType = scheduleServiceType ? scheduleServiceType.value : 'delivery';
    const serviceEmoji = serviceType === 'delivery' ? '📦' : '🏍️';
    const serviceName = serviceType === 'delivery' ? 'Parcel Delivery' : 'Passenger Ride';
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = selectedDate.toLocaleDateString('en-US', options);
    
    const whatsappMessage = encodeURIComponent(
      `Hello Marindany Logistics!\n\n${serviceEmoji} *Scheduled ${serviceName}*\n\n📅 Date: ${formattedDate}\n🕐 Time: ${selectedTimeSlot}\n\nPlease confirm my booking. Thank you! 🙏`
    );
    
    const whatsappURL = `https://wa.me/254725351381?text=${whatsappMessage}`;
    
    scheduleFeedback.textContent = '✨ Opening WhatsApp to confirm your schedule...';
    scheduleFeedback.className = 'text-sm text-center text-brandLime-400 mt-3';
    scheduleFeedback.classList.remove('hidden');
    scheduleFeedback.setAttribute('role', 'status');
    
    setTimeout(() => {
      window.open(whatsappURL, '_blank', 'noopener,noreferrer');
    }, 500);
    
    setTimeout(() => {
      scheduleFeedback.classList.add('hidden');
      scheduleFeedback.setAttribute('role', '');
      selectedDate = null;
      selectedTimeSlot = null;
      calendarGrid.querySelectorAll('.calendar-day.selected').forEach(btn => {
        btn.classList.remove('selected');
      });
      timeSlotBtns.forEach(b => {
        b.classList.remove('bg-brandGold-400', 'text-black', 'border-brandGold-400');
        b.classList.add('bg-zinc-900', 'text-white', 'border-zinc-800');
        b.removeAttribute('aria-selected');
      });
      if (selectedDateDisplay) {
        selectedDateDisplay.textContent = 'Please select a date from the calendar';
      }
      updateScheduleButton();
    }, 3000);
  }

  // ============ FAQ ACCORDION (FIXED) ============
  function setupFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
      const summary = item.querySelector('summary');
      if (!summary) return;
      
      // Fix: Add proper ARIA attributes
      const content = item.querySelector('.faq-content');
      if (content) {
        const id = `faq-content-${Math.random().toString(36).substr(2, 9)}`;
        content.id = id;
        summary.setAttribute('aria-controls', id);
        summary.setAttribute('aria-expanded', 'false');
      }
      
      summary.addEventListener('click', (e) => {
        const isOpening = !item.hasAttribute('open');
        
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.hasAttribute('open')) {
            otherItem.removeAttribute('open');
            const otherSummary = otherItem.querySelector('summary');
            if (otherSummary) otherSummary.setAttribute('aria-expanded', 'false');
          }
        });
        
        if (summary) summary.setAttribute('aria-expanded', isOpening ? 'true' : 'false');
        
        if (isOpening) {
          setTimeout(() => {
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 100);
        }
      });
    });
  }

  // ============ SCROLL ANIMATIONS (FIXED PERFORMANCE) ============
  function setupScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;
    
    // Fix: Only animate elements that are initially below viewport
    const animatedElements = document.querySelectorAll('section, .card-premium, .faq-item');
    
    animatedElements.forEach((el, index) => {
      // Use CSS classes instead of inline styles for better performance
      el.classList.add('scroll-animate');
      el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    });
    
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          animationObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -30px 0px'
    });
    
    animatedElements.forEach(el => animationObserver.observe(el));
  }

  // ============ KEYBOARD NAVIGATION ============
  function setupKeyboardNavigation() {
    document.querySelectorAll('button, a, input, select, textarea').forEach(el => {
      if (!el.hasAttribute('tabindex') && el.tagName !== 'BUTTON' && el.tagName !== 'A' && el.tagName !== 'INPUT' && el.tagName !== 'SELECT' && el.tagName !== 'TEXTAREA') {
        el.setAttribute('tabindex', '0');
      }
    });
  }

  // ============ CARD HOVER EFFECTS ============
  function setupCardHoverEffects() {
    document.querySelectorAll('.card-premium').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
      });
    });
  }

  // ============ SMOOTH SCROLL ============
  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
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
          
          history.pushState(null, '', targetId);
          
          targetElement.setAttribute('tabindex', '-1');
          targetElement.focus({ preventScroll: true });
        }
      });
    });
  }

  // ============ IMAGE LAZY LOADING ============
  function setupImageLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) return;
    
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if (!('IntersectionObserver' in window) || lazyImages.length === 0) return;
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '200px 0px'
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // ============ ACCESSIBILITY ENHANCEMENTS ============
  function addAccessibilityEnhancements() {
    const mainElement = document.querySelector('main');
    if (mainElement && !mainElement.hasAttribute('id')) {
      mainElement.setAttribute('id', 'main-content');
    }
    
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
      if (!link.hasAttribute('rel')) {
        link.setAttribute('rel', 'noopener noreferrer');
      }
      if (!link.hasAttribute('aria-label')) {
        const text = link.textContent.trim();
        link.setAttribute('aria-label', text ? text + ' (opens in new tab)' : 'Opens in new tab');
      }
    });
    
    // Fix: Add skip to main content
    const skipLink = document.querySelector('.skip-to-main');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const main = document.getElementById('main-content');
        if (main) {
          main.setAttribute('tabindex', '-1');
          main.focus();
        }
      });
    }
  }

  // ============ PREVENT DOUBLE-TAP ZOOM ============
  function preventZoomOnDoubleTap() {
    let lastTouch = 0;
    document.addEventListener('touchend', (e) => {
      const now = Date.now();
      const timeSince = now - lastTouch;
      
      if (timeSince < 300 && timeSince > 0) {
        e.preventDefault();
      }
      
      lastTouch = now;
    }, { passive: false });
  }

  // ============ ADD CSS FOR ANIMATIONS ============
  function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .menu-closed {
        visibility: hidden;
        opacity: 0;
        transform: translateY(-8px);
        transition: visibility 0.3s, opacity 0.3s, transform 0.3s;
        display: block !important;
      }
      .menu-open {
        visibility: visible;
        opacity: 1;
        transform: translateY(0);
        transition: visibility 0.3s, opacity 0.3s, transform 0.3s;
        display: block !important;
      }
      .scroll-animate {
        opacity: 0;
        transform: translateY(20px);
      }
      .scroll-animate.visible {
        opacity: 1;
        transform: translateY(0);
      }
      .calendar-day:focus-visible {
        outline: 2px solid #84cc16;
        outline-offset: 2px;
      }
    `;
    document.head.appendChild(style);
  }

  // ============ ERROR HANDLING ============
  window.addEventListener('error', function(e) {
    console.error('Global error:', e.message);
  });

  window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
  });

  // ============ START ============
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      addAnimationStyles();
      init();
    });
  } else {
    addAnimationStyles();
    init();
  }

})();