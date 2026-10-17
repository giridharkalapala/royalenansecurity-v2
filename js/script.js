/**
 * Royal Enan Security Services — Main Interaction Script
 * Includes: Hero Slider, Animated Counters, Client Carousel, Testimonials,
 * Modals (ISO Certificate, Video, Quote), Mobile Nav, and AOS initialization.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. Initialize AOS (Animate on Scroll)
  // =========================================================================
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
      disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    });
  }

  // =========================================================================
  // 2. Sticky Header Scroll Effect
  // =========================================================================
  const siteHeader = document.getElementById('siteHeader');
  const backToTopBtn = document.getElementById('backToTopBtn');

  function handleHeaderScroll() {
    const scrollPos = window.scrollY || window.pageYOffset;
    if (siteHeader) {
      if (scrollPos > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (scrollPos > 400) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.visibility = 'visible';
      } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.visibility = 'hidden';
      }
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =========================================================================
  // 3. Mobile Navigation Drawer
  // =========================================================================
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');
  const mobileCloseBtn = document.getElementById('mobileCloseBtn');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    if (mobileNavDrawer && mobileNavBackdrop) {
      mobileNavDrawer.classList.add('open');
      mobileNavBackdrop.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileMenu() {
    if (mobileNavDrawer && mobileNavBackdrop) {
      mobileNavDrawer.classList.remove('open');
      mobileNavBackdrop.classList.remove('show');
      document.body.style.overflow = '';
    }
  }

  if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', openMobileMenu);
  if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMobileMenu);
  if (mobileNavBackdrop) mobileNavBackdrop.addEventListener('click', closeMobileMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

  // =========================================================================
  // 4. Hero Slider Implementation
  // =========================================================================
  const heroSlides = document.querySelectorAll('.hero-slide');
  const sliderNavItems = document.querySelectorAll('.slider-nav-item');
  let currentSlideIndex = 0;
  let heroSliderTimer = null;
  const slideDuration = 6000;

  function showSlide(index) {
    if (!heroSlides.length) return;
    heroSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    sliderNavItems.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });
    currentSlideIndex = index;
  }

  function nextSlide() {
    const nextIndex = (currentSlideIndex + 1) % heroSlides.length;
    showSlide(nextIndex);
  }

  function startHeroSlider() {
    stopHeroSlider();
    heroSliderTimer = setInterval(nextSlide, slideDuration);
  }

  function stopHeroSlider() {
    if (heroSliderTimer) clearInterval(heroSliderTimer);
  }

  sliderNavItems.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      showSlide(i);
      startHeroSlider(); // Reset timer
    });
  });

  const heroSection = document.getElementById('heroSection');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopHeroSlider);
    heroSection.addEventListener('mouseleave', startHeroSlider);
  }

  startHeroSlider();

  // =========================================================================
  // 5. Animated Statistics Counters
  // =========================================================================
  const counterElements = document.querySelectorAll('.stat-count');
  let countersAnimated = false;

  function animateCounters() {
    counterElements.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const suffix = counter.getAttribute('data-suffix') || '';
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 45));
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          counter.textContent = target + suffix;
          clearInterval(interval);
        } else {
          counter.textContent = current + suffix;
        }
      }, 30);
    });
  }

  const statsSection = document.getElementById('aboutStatsRow');
  if (statsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !countersAnimated) {
        countersAnimated = true;
        animateCounters();
      }
    }, { threshold: 0.3 });
    observer.observe(statsSection);
  } else {
    animateCounters();
  }

  // =========================================================================
  // 6. Trusted Clients Carousel (Continuous Infinite Auto-Scroll)
  // =========================================================================
  const trackContainer = document.querySelector('.clients-carousel-track-container');
  const clientsTrack = document.getElementById('clientsTrack');
  const prevClientBtn = document.getElementById('prevClientBtn');
  const nextClientBtn = document.getElementById('nextClientBtn');

  if (trackContainer && clientsTrack) {
    // Clone children to ensure seamless infinite looping
    const originalCards = Array.from(clientsTrack.children);
    originalCards.forEach(card => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clientsTrack.appendChild(clone);
    });

    let isPaused = false;
    const scrollSpeed = 0.85; // smooth pixels per frame
    let animationFrameId = null;

    function autoScroll() {
      if (!isPaused) {
        trackContainer.scrollLeft += scrollSpeed;
        const halfWidth = clientsTrack.scrollWidth / 2;
        if (trackContainer.scrollLeft >= halfWidth) {
          trackContainer.scrollLeft -= halfWidth;
        } else if (trackContainer.scrollLeft <= 0) {
          trackContainer.scrollLeft += halfWidth;
        }
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    }

    animationFrameId = requestAnimationFrame(autoScroll);

    // Pause on hover & touch
    trackContainer.addEventListener('mouseenter', () => { isPaused = true; });
    trackContainer.addEventListener('mouseleave', () => { isPaused = false; });
    trackContainer.addEventListener('touchstart', () => { isPaused = true; }, { passive: true });
    trackContainer.addEventListener('touchend', () => { isPaused = false; }, { passive: true });

    // Arrow navigation buttons
    const cardStep = 220;

    if (nextClientBtn) {
      nextClientBtn.addEventListener('click', () => {
        isPaused = true;
        trackContainer.scrollBy({ left: cardStep, behavior: 'smooth' });
        setTimeout(() => {
          const halfWidth = clientsTrack.scrollWidth / 2;
          if (trackContainer.scrollLeft >= halfWidth) {
            trackContainer.scrollLeft -= halfWidth;
          }
          isPaused = false;
        }, 450);
      });
      nextClientBtn.addEventListener('mouseenter', () => { isPaused = true; });
      nextClientBtn.addEventListener('mouseleave', () => { isPaused = false; });
    }

    if (prevClientBtn) {
      prevClientBtn.addEventListener('click', () => {
        isPaused = true;
        const halfWidth = clientsTrack.scrollWidth / 2;
        if (trackContainer.scrollLeft <= 10) {
          trackContainer.scrollLeft += halfWidth;
        }
        trackContainer.scrollBy({ left: -cardStep, behavior: 'smooth' });
        setTimeout(() => {
          isPaused = false;
        }, 450);
      });
      prevClientBtn.addEventListener('mouseenter', () => { isPaused = true; });
      prevClientBtn.addEventListener('mouseleave', () => { isPaused = false; });
    }
  }

  // =========================================================================
  // 7. Testimonials Slider
  // =========================================================================
  const testimonials = [
    {
      quote: "“Royal Enan Security Services has been our trusted security partner for over 3 years. Their team is professional, responsive and always ensures the highest level of safety.”",
      name: "Ramesh Kumar",
      role: "Facility Manager, Signova",
      avatar: "assets/images/testimonial-avatar.jpg"
    },
    {
      quote: "“The deployment of verified personnel and round-the-clock proactive surveillance has significantly improved safety standards across our commercial facilities in Hyderabad.”",
      name: "Vikram Malhotra",
      role: "Operations Director, Advanced Tech Parks",
      avatar: "assets/images/about-security-guard.jpg"
    },
    {
      quote: "“Exceptional responsiveness and highly disciplined guards. Their customized security plan perfectly fit our high-end retail mall requirements.”",
      name: "Anita Deshmukh",
      role: "General Manager, Grand Luxury Retail",
      avatar: "assets/images/testimonial-avatar.jpg"
    }
  ];

  let currentTestimonialIndex = 0;
  const quoteTextElem = document.getElementById('testimonialQuoteText');
  const authorNameElem = document.getElementById('testimonialAuthorName');
  const authorRoleElem = document.getElementById('testimonialAuthorRole');
  const authorAvatarElem = document.getElementById('testimonialAuthorAvatar');
  const prevTestimBtn = document.getElementById('prevTestimBtn');
  const nextTestimBtn = document.getElementById('nextTestimBtn');

  function renderTestimonial(index) {
    if (!quoteTextElem) return;
    const item = testimonials[index];
    quoteTextElem.style.opacity = '0';
    setTimeout(() => {
      quoteTextElem.textContent = item.quote;
      authorNameElem.textContent = item.name;
      authorRoleElem.textContent = item.role;
      if (authorAvatarElem) authorAvatarElem.src = item.avatar;
      quoteTextElem.style.opacity = '1';
    }, 200);
  }

  if (nextTestimBtn) {
    nextTestimBtn.addEventListener('click', () => {
      currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
      renderTestimonial(currentTestimonialIndex);
    });
  }

  if (prevTestimBtn) {
    prevTestimBtn.addEventListener('click', () => {
      currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
      renderTestimonial(currentTestimonialIndex);
    });
  }

  // =========================================================================
  // 8. Modals Management (ISO Certificate, Video, Quote Consultation)
  // =========================================================================
  const allModals = document.querySelectorAll('.modal-custom-backdrop');

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = '';
      // If modal contains an iframe or video, pause it
      const video = modal.querySelector('video');
      if (video) video.pause();
    }
  }

  // Triggers
  document.querySelectorAll('[data-open-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-open-modal');
      openModal(targetId);
    });
  });

  // Close buttons inside modals
  document.querySelectorAll('.modal-close-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-custom-backdrop');
      closeModal(modal);
    });
  });

  // Click outside modal window to close
  allModals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Escape key closes modals & mobile drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      allModals.forEach(closeModal);
      closeMobileMenu();
    }
  });

  // Quote Form Submission (Interactive Feedback)
  const quoteForm = document.getElementById('quoteConsultationForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = quoteForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        const origText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i> Submitting...';
        submitBtn.disabled = true;

        setTimeout(() => {
          submitBtn.innerHTML = '<i class="fa-solid fa-check me-2"></i> Request Received!';
          submitBtn.classList.remove('btn-gold');
          submitBtn.style.background = '#10b981';
          submitBtn.style.color = '#fff';

          setTimeout(() => {
            const modal = quoteForm.closest('.modal-custom-backdrop');
            closeModal(modal);
            quoteForm.reset();
            submitBtn.innerHTML = origText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
            submitBtn.style.color = '';
            submitBtn.classList.add('btn-gold');
            alert('Thank you! Your quote request has been received. Our security specialist will contact you shortly.');
          }, 1200);
        }, 1000);
      }
    });
  }

  // Active navigation link tracking on scroll
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link-custom');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPosition = window.pageYOffset + 150;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentId}` || (currentId === 'heroSection' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

});
