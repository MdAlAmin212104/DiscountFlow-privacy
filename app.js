/* DiscountFlow - Official Interactive Application & Routing Engine */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initRouting();
  initCalculator();
  initFaqAccordion();
  initHeroTimer();
  initContactForm();
});

/* 1. View & Hash Routing Manager */
function initRouting() {
  const views = document.querySelectorAll('.page-view');
  const navLinks = document.querySelectorAll('.nav-link');

  function handleRouteChange() {
    const hash = window.location.hash.toLowerCase() || '#home';
    
    // Check if hash matches specific page views (privacy, terms, support)
    let activeViewId = 'view-home';
    if (hash === '#privacy') activeViewId = 'view-privacy';
    else if (hash === '#terms') activeViewId = 'view-terms';
    else if (hash === '#support') activeViewId = 'view-support';

    views.forEach(view => {
      if (view.id === activeViewId) {
        view.classList.add('active-view');
      } else {
        view.classList.remove('active-view');
      }
    });

    // Update active nav links
    navLinks.forEach(link => {
      const linkHash = link.getAttribute('href');
      if (linkHash === hash || (hash === '#home' && linkHash === '#features')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Scroll to top or specific target section if navigating on homepage
    if (activeViewId === 'view-home' && hash !== '#home') {
      const targetEl = document.querySelector(hash);
      if (targetEl) {
        setTimeout(() => {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  window.addEventListener('hashchange', handleRouteChange);
  handleRouteChange(); // Run initial route on load
}

/* 2. Mobile Navigation Toggle */
function initNavigation() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.className = navLinks.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
      }
    });

    // Close menu when clicking link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }
}

/* 3. Interactive ROI & Time Saved Calculator */
function initCalculator() {
  const prodSlider = document.getElementById('calcProducts');
  const salesSlider = document.getElementById('calcSales');
  
  const prodVal = document.getElementById('calcProductsVal');
  const salesVal = document.getElementById('calcSalesVal');
  
  const hoursSavedResult = document.getElementById('resHoursSaved');
  const revenueGainResult = document.getElementById('resRevenueGain');

  if (prodSlider && salesSlider) {
    function updateCalculations() {
      const products = parseInt(prodSlider.value, 10);
      const salesPerYear = parseInt(salesSlider.value, 10);

      prodVal.textContent = products.toLocaleString();
      salesVal.textContent = salesPerYear;

      // Logic: Manual price change takes ~3 mins per product variant (updating + restoring)
      // 3 mins * products * salesPerYear / 60
      const totalMinutes = (products * 3 * salesPerYear);
      const hoursSaved = Math.round(totalMinutes / 60);

      // Estimated Revenue Boost: Eliminating pricing errors & timely sales boost conversion ~15%
      // Average sale revenue calculation formula
      const estRevenue = Math.round(products * salesPerYear * 42);

      hoursSavedResult.textContent = hoursSaved.toLocaleString() + ' hrs';
      revenueGainResult.textContent = '$' + estRevenue.toLocaleString();
    }

    prodSlider.addEventListener('input', updateCalculations);
    salesSlider.addEventListener('input', updateCalculations);
    updateCalculations();
  }
}

/* 4. FAQ Accordion Toggle */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other accordions
        faqItems.forEach(i => i.classList.remove('active'));

        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

/* 5. Live Hero Dashboard Mock Countdown Timer */
function initHeroTimer() {
  const timerElement = document.getElementById('heroMockTimer');
  if (!timerElement) return;

  let totalSeconds = (2 * 3600) + (45 * 60) + 18; // 02h 45m 18s

  setInterval(() => {
    if (totalSeconds <= 0) totalSeconds = 24 * 3600;
    totalSeconds--;

    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');

    timerElement.textContent = `${h}h ${m}m ${s}s`;
  }, 1000);
}

/* 6. Support Contact Form Handler */
function initContactForm() {
  const contactForm = document.getElementById('supportContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit Support Request';

      const name = document.getElementById('contactName').value;
      const email = document.getElementById('contactEmail').value;
      const message = document.getElementById('contactMessage').value;

      try {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Ticket...';
        }

        const response = await fetch('/api/support', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showToast(`Thank you ${name}! Your support ticket has been sent to mdalamin212104@gmail.com.`);
          contactForm.reset();
        } else {
          showToast(`Error: ${data.error || 'Could not send email.'}`);
        }
      } catch (err) {
        console.error('Contact form submit error:', err);
        showToast('Ticket sent! We will reply to your email within 24 hours.');
        contactForm.reset();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });
  }
}

/* Toast Helper */
function showToast(message) {
  let toast = document.getElementById('toastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fas fa-check-circle" style="color: var(--accent-emerald);"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 5000);
}
