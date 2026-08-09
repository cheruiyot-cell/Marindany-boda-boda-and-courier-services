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
    setupScrollAnimations();
    setupCardHoverEffects();
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

    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (isMenuOpen) {
          closeMobileMenu();
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMobileMenu();
        mobileMenuBtn.focus();
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
    if (isMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function openMobileMenu() {
    mobileMenu.classList.remove('hidden');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    
    if (hamburgerIcon) {
      hamburgerIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';
    }
    
    isMenuOpen = true;
    
    const firstFocusable = mobileMenu.querySelector('a');
    if (firstFocusable) {
      setTimeout(() => firstFocusable.focus(), 100);
    }
  }

  function closeMobileMenu() {
    mobileMenu.classList.add('hidden');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    
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
        parcelTypeContainer.style.opacity = '1';
        parcelTypeContainer.style.maxHeight = '200px';
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
        parcelTypeContainer.style.transition = 'all 0.3s ease';
      }
      
      const submitBtn = document.getElementById('submit-btn');
      if (submitBtn) {
        const span = submitBtn.querySelector('span');
        if (span) span.textContent = 'Book Ride via WhatsApp';
      }
    }
  }

  // ============ BOOKING FORM ============
  function setupBookingForm() {
    if (!bookingForm) return;

    bookingForm.addEventListener('submit', handleFormSubmit);
    
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
    if (!field) return false;
    
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
    
    clearTimeout(formFeedback._hideTimeout);
    formFeedback._hideTimeout = setTimeout(() => {
      formFeedback.classList.add('hidden');
    }, 5000);
  }

  // ============ CALENDAR SYSTEM (FIXED) ============
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
    
    // Time slot selection
    timeSlotBtns.forEach(btn => {
      btn.addEventListener('click', () => selectTimeSlot(btn));
    });
    
    // Schedule booking button
    if (scheduleBookingBtn) {
      scheduleBookingBtn.addEventListener('click', handleScheduleBooking);
    }
  }

  function renderCalendar() {
    if (!calendarGrid || !calendarMonthYear) return;
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Update header
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    calendarMonthYear.textContent = `${monthNames[month]} ${year}`;
    
    // Get first day of month and total days
    const firstDay = new Date(year, month, 1).getDay();
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1; // Adjust for Monday start
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Get today's date for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let calendarHTML = '';
    
    // Add empty cells for days before first day
    for (let i = 0; i < adjustedFirstDay; i++) {
      calendarHTML += '<div class="calendar-day empty"></div>';
    }
    
    // Add day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);
      
      const isToday = date.getTime() === today.getTime();
      const isPast = date < today;
      
      // FIXED: Only block past dates — all future dates are now available
      const isUnavailable = isPast;
      
      const isSelected = selectedDate && 
                         date.getFullYear() === selectedDate.getFullYear() &&
                         date.getMonth() === selectedDate.getMonth() &&
                         date.getDate() === selectedDate.getDate();
      
      let dayClass = 'calendar-day';
      if (isToday) dayClass += ' today';
      if (isUnavailable) dayClass += ' unavailable';
      if (isSelected) dayClass += ' selected';
      
      calendarHTML += `
        <button 
          class="${dayClass}"
          data-date="${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}"
          ${isUnavailable ? 'disabled' : ''}
          aria-label="${monthNames[month]} ${day}, ${year}${isUnavailable ? ' (unavailable)' : ''}"
        >
          ${day}
        </button>
      `;
    }
    
    calendarGrid.innerHTML = calendarHTML;
    
    // Add click handlers to available days
    calendarGrid.querySelectorAll('.calendar-day:not(.empty):not(.unavailable)').forEach(dayBtn => {
      dayBtn.addEventListener('click', () => selectDate(dayBtn));
    });
  }

  // NOTE: The generateUnavailableDates function has been removed entirely.
  // If you need to block specific dates in the future (holidays, fully booked days),
  // add a simple array here like:
  // const blockedDates = ['2026-12-25', '2027-01-01'];
  // Then check against it in renderCalendar.

  function selectDate(dayBtn) {
    // Remove previous selection
    calendarGrid.querySelectorAll('.calendar-day.selected').forEach(btn => {
      btn.classList.remove('selected');
    });
    
    // Add new selection
    dayBtn.classList.add('selected');
    const dateStr = dayBtn.getAttribute('data-date');
    selectedDate = new Date(dateStr + 'T00:00:00');
    
    // Update display
    if (selectedDateDisplay) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      selectedDateDisplay.textContent = `📅 ${selectedDate.toLocaleDateString('en-US', options)}`;
    }
    
    // Enable time slot selection
    timeSlotBtns.forEach(btn => {
      btn.disabled = false;
      btn.classList.remove('opacity-50', 'cursor-not-allowed');
    });
    
    // Reset time slot selection
    selectedTimeSlot = null;
    timeSlotBtns.forEach(b => {
      b.classList.remove('bg-brandGold-400', 'text-black', 'border-brandGold-400');
      b.classList.add('bg-zinc-900', 'text-white', 'border-zinc-800');
    });
    updateScheduleButton();
  }

  function selectTimeSlot(btn) {
    if (!selectedDate) return;
    
    // Remove previous time selection
    timeSlotBtns.forEach(b => {
      b.classList.remove('bg-brandGold-400', 'text-black', 'border-brandGold-400');
      b.classList.add('bg-zinc-900', 'text-white', 'border-zinc-800');
    });
    
    // Add new selection
    btn.classList.remove('bg-zinc-900', 'text-white', 'border-zinc-800');
    btn.classList.add('bg-brandGold-400', 'text-black', 'border-brandGold-400');
    selectedTimeSlot = btn.getAttribute('data-time');
    
    updateScheduleButton();
  }

  function updateScheduleButton() {
    if (scheduleBookingBtn) {
      if (selectedDate && selectedTimeSlot) {
        scheduleBookingBtn.disabled = false;
        scheduleBookingBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      } else {
        scheduleBookingBtn.disabled = true;
        scheduleBookingBtn.classList.add('opacity-50', 'cursor-not-allowed');
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
    scheduleFeedback.className = 'text-xs text-center text-brandLime-400 mt-3';
    scheduleFeedback.classList.remove('hidden');
    
    setTimeout(() => {
      window.open(whatsappURL, '_blank', 'noopener,noreferrer');
    }, 500);
    
    // Reset after 3 seconds
    setTimeout(() => {
      scheduleFeedback.classList.add('hidden');
      selectedDate = null;
      selectedTimeSlot = null;
      calendarGrid.querySelectorAll('.calendar-day.selected').forEach(btn => {
        btn.classList.remove('selected');
      });
      timeSlotBtns.forEach(b => {
        b.classList.remove('bg-brandGold-400', 'text-black', 'border-brandGold-400');
        b.classList.add('bg-zinc-900', 'text-white', 'border-zinc-800');
      });
      if (selectedDateDisplay) {
        selectedDateDisplay.textContent = 'Please select a date from the calendar';
      }
      updateScheduleButton();
    }, 3000);
  }

  // ============ FAQ ACCORDION ============
  function setupFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
      const summary = item.querySelector('summary');
      if (!summary) return;
      
      summary.addEventListener('click', () => {
        const isOpening = !item.hasAttribute('open');
        
        // Close other open items
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.hasAttribute('open')) {
            otherItem.removeAttribute('open');
          }
        });
        
        // Smooth scroll to item if opening
        if (isOpening) {
          setTimeout(() => {
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 100);
        }
      });
    });
  }

  // ============ SCROLL ANIMATIONS ============
  function setupScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;
    
    const animatedElements = document.querySelectorAll('section, .card-premium, .faq-item');
    
    animatedElements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      el.style.transitionDelay = `${index * 0.1}s`;
    });
    
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          animationObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => animationObserver.observe(el));
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
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
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
    if (mainElement && !mainElement.hasAttribute('id')) {
      mainElement.setAttribute('id', 'main-content');
    }
    
    // Ensure all external links have proper attributes
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
      if (!link.hasAttribute('rel')) {
        link.setAttribute('rel', 'noopener noreferrer');
      }
      
      if (!link.hasAttribute('aria-label')) {
        const text = link.textContent.trim();
        link.setAttribute('aria-label', text ? text + ' (opens in new tab)' : 'Opens in new tab');
      }
    });
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
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();