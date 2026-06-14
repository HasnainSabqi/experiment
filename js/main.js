document.addEventListener('DOMContentLoaded', () => {
  // --- MOBILE NAV TOGGLE ---
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');
  
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mainNav.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) {
        mainNav.classList.remove('active');
        navToggle.classList.remove('active');
      }
    });
  }

  // --- ACTIVE NAV LINK HIGHLIGHT ---
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.main-nav a');
  
  navLinks.forEach(link => {
    // Get page name (e.g. index.html or services.html)
    const href = link.getAttribute('href');
    if (currentPath.endsWith(href) || 
        (currentPath.endsWith('/') && href === 'index.html') ||
        (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // --- MEDICAL STATUS CHECK FORM & MODAL ---
  const medicalForm = document.getElementById('medical-status-form');
  const modalOverlay = document.getElementById('countdown-modal');
  const countdownNumber = document.getElementById('countdown-number');
  const progressCircle = document.getElementById('countdown-progress');
  const modalClose = document.getElementById('modal-close');
  
  if (medicalForm && modalOverlay && countdownNumber && progressCircle) {
    const totalDuration = 5; // seconds
    let timeLeft = totalDuration;
    let timerInterval = null;
    const circumference = 339; // matches CSS stroke-dasharray

    // Pre-set progress to full
    progressCircle.style.strokeDashoffset = '0';

    medicalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const passportInput = document.getElementById('passport_number');
      const countrySelect = document.getElementById('country');
      
      if (!passportInput.value.trim()) {
        alert('Please enter a valid passport number.');
        passportInput.focus();
        return;
      }
      
      if (!countrySelect.value) {
        alert('Please select a country.');
        countrySelect.focus();
        return;
      }

      // Open Modal
      modalOverlay.classList.add('active');
      startCountdown(passportInput.value.trim(), countrySelect.value);
    });

    if (modalClose) {
      modalClose.addEventListener('click', () => {
        clearInterval(timerInterval);
        modalOverlay.classList.remove('active');
        timeLeft = totalDuration;
        progressCircle.style.strokeDashoffset = '0';
        countdownNumber.textContent = totalDuration;
      });
    }

    function startCountdown(passport, country) {
      timeLeft = totalDuration;
      countdownNumber.textContent = timeLeft;
      progressCircle.style.strokeDashoffset = '0';
      
      const intervalMs = 50; // smooth update every 50ms
      const totalSteps = (totalDuration * 1000) / intervalMs;
      let step = 0;

      timerInterval = setInterval(() => {
        step++;
        const timeElapsed = (step * intervalMs) / 1000;
        timeLeft = Math.max(0, totalDuration - timeElapsed);
        
        // Update countdown text (whole seconds)
        countdownNumber.textContent = Math.ceil(timeLeft);
        
        // Update circle progress
        const progressPercent = (timeLeft / totalDuration);
        const offset = circumference - (progressPercent * circumference);
        progressCircle.style.strokeDashoffset = offset;

        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          // Construct target Wafid search URL
          // Secure external redirect
          const targetUrl = `https://wafid.com/en/medical-status-search/?passport_number=${encodeURIComponent(passport)}&country=${encodeURIComponent(country)}`;
          window.location.href = targetUrl;
        }
      }, intervalMs);
    }
  }

  // --- FLOATING WHATSAPP CHAT LOGIC ---
  const whatsappBubble = document.getElementById('whatsapp-bubble');
  if (whatsappBubble) {
    whatsappBubble.addEventListener('click', () => {
      const waUrl = whatsappBubble.getAttribute('data-url');
      if (waUrl) {
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      }
    });
  }
});
