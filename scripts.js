document.addEventListener('DOMContentLoaded', () => {
  // --- Update footer year ---
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Mobile menu toggle ---
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('hidden');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- Tab switching (parcel vs ride) ---
  const tabSend = document.getElementById('tab-send');
  const tabRide = document.getElementById('tab-ride');
  const parcelTypeContainer = document.getElementById('parcel-type-container');
  let activeMode = 'parcel';

  function setActiveTab(active) {
    const tabs = [tabSend, tabRide];
    tabs.forEach(t => {
      const isActive = t === active;
      t.setAttribute('aria-selected', isActive);
      t.className = isActive
        ? 'flex-1 py-3 rounded-lg font-medium transition-all text-xs sm:text-sm bg-zinc-900 text-white shadow-sm focus:outline-none focus:ring-1 focus:ring-brandLime-500'
        : 'flex-1 py-3 rounded-lg font-medium transition-all text-xs sm:text-sm text-zinc-500 hover:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-brandLime-500';
    });
  }

  if (tabSend && tabRide) {
    tabSend.addEventListener('click', () => {
      activeMode = 'parcel';
      setActiveTab(tabSend);
      if (parcelTypeContainer) parcelTypeContainer.classList.remove('hidden');
    });

    tabRide.addEventListener('click', () => {
      activeMode = 'ride';
      setActiveTab(tabRide);
      if (parcelTypeContainer) parcelTypeContainer.classList.add('hidden');
    });
  }

  // --- Form submission: generate WhatsApp link ---
  const bookingForm = document.getElementById('booking-form');
  const feedbackEl = document.getElementById('form-feedback');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const pickup = document.getElementById('input-pickup').value.trim();
      const dropoff = document.getElementById('input-dropoff').value.trim();
      const notes = document.getElementById('input-notes').value.trim();
      const packageType = document.getElementById('input-package-type')?.value || '';

      if (!pickup || !dropoff) {
        if (feedbackEl) {
          feedbackEl.textContent = '⚠️ Please fill in both pickup and drop-off locations.';
          feedbackEl.className = 'text-xs text-center text-red-400 block';
        }
        return;
      }

      let message = '';
      if (activeMode === 'parcel') {
        message = `Hello Marindany Logistics! 📦 I want to request a parcel delivery:\n\n📍 Pickup: ${pickup}\n🏁 Drop-off: ${dropoff}\n📦 Item: ${packageType}`;
      } else {
        message = `Hello Marindany Logistics! 🏍️ I want to book a passenger ride:\n\n📍 Pickup: ${pickup}\n🏁 Destination: ${dropoff}`;
      }

      if (notes) {
        message += `\n📝 Note: ${notes}`;
      }

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/254725351381?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');

      // Show success feedback
      if (feedbackEl) {
        feedbackEl.textContent = '✅ WhatsApp opened! Your message is ready to send.';
        feedbackEl.className = 'text-xs text-center text-brandLime-400 block';
        setTimeout(() => {
          feedbackEl.textContent = '';
          feedbackEl.className = 'text-xs text-center text-brandLime-400 hidden';
        }, 4000);
      }
    });
  }
});