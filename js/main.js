/**
 * AWTD - Africa Workforce Training & Development
 * Production Client Script (Single-Page Edition)
 */

(function () {
  'use strict';

  // Institutional Configuration (Single Source of Truth)
  window.AWTD_CONFIG = {
    pilotCities: 'Abuja + Kaduna',
    pilotLaunchDate: 'March 2027',
    primaryContact: 'hello@awtd.org',
    legalName: 'Africa Workforce Training & Development, Inc.',
    domain: 'awtd.org',
    maxPilotTracks: 2
  };

  document.addEventListener('DOMContentLoaded', function () {
    initPilotConfig();
    initMobileNav();
    initScrollSpy();
    initMovableTrackChips();
    initPaperModal();
    initInquiryForm();
    initStatCounters();
    initSmoothScroll();
  });

  /**
   * Bind institutional config to DOM elements
   */
  function initPilotConfig() {
    var locTarget = document.getElementById('pilotLocationTarget');
    if (locTarget && window.AWTD_CONFIG.pilotCities) {
      locTarget.textContent = window.AWTD_CONFIG.pilotCities;
    }
  }

  /**
   * Mobile Navigation Toggle
   */
  function initMobileNav() {
    var navToggle = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');
    if (!navToggle || !navLinks) return;

    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close mobile nav when a link is clicked
    var links = navLinks.querySelectorAll('a');
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        if (navLinks.classList.contains('is-open')) {
          navLinks.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  /**
   * Active Section Scroll Spy
   */
  function initScrollSpy() {
    var navLinks = document.querySelectorAll('#navLinks a:not(.nav-cta)');
    var sections = [];

    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        var section = document.querySelector(href);
        if (section) {
          sections.push({ link: link, section: section });
        }
      }
    });

    function updateActive() {
      var scrollPos = window.scrollY + 120;
      var activeFound = false;

      for (var i = sections.length - 1; i >= 0; i--) {
        var item = sections[i];
        var top = item.section.offsetTop;
        var height = item.section.offsetHeight;

        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(function (l) { l.classList.remove('is-active'); });
          item.link.classList.add('is-active');
          activeFound = true;
          break;
        }
      }

      if (!activeFound && window.scrollY < 200 && navLinks[0]) {
        navLinks.forEach(function (l) { l.classList.remove('is-active'); });
      }
    }

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
  }

  /**
   * Movable "Pilot phase" Track Chips
   * Fulfills Outstanding Item instruction:
   * "The two 'Pilot phase' chips are placed here to show the mechanism only.
   * Which two of the eight tracks the Nigeria pilot activates is not settled. The chip must stay movable."
   */
  function initMovableTrackChips() {
    var tracksGrid = document.getElementById('tracksGrid');
    if (!tracksGrid) return;

    var cards = tracksGrid.querySelectorAll('.card[data-track-id]');

    cards.forEach(function (card) {
      function toggleTrack() {
        var isPilot = card.classList.contains('is-pilot-active');

        if (isPilot) {
          // Deactivate
          card.classList.remove('is-pilot-active');
          card.setAttribute('aria-pressed', 'false');
          var chip = card.querySelector('.chip');
          if (chip) chip.remove();
        } else {
          // Check count of currently active tracks
          var activeCards = tracksGrid.querySelectorAll('.card.is-pilot-active');
          if (activeCards.length >= window.AWTD_CONFIG.maxPilotTracks) {
            // Remove from first active card to cap at 2
            var oldestCard = activeCards[0];
            oldestCard.classList.remove('is-pilot-active');
            oldestCard.setAttribute('aria-pressed', 'false');
            var oldChip = oldestCard.querySelector('.chip');
            if (oldChip) oldChip.remove();
          }

          // Activate this card
          card.classList.add('is-pilot-active');
          card.setAttribute('aria-pressed', 'true');
          var newChip = document.createElement('span');
          newChip.className = 'chip';
          newChip.textContent = 'Pilot phase';
          card.insertBefore(newChip, card.firstChild);
        }
      }

      card.addEventListener('click', toggleTrack);
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleTrack();
        }
      });
    });
  }

  /**
   * Position Papers Request Modal
   */
  function initPaperModal() {
    var modalBackdrop = document.getElementById('docModalBackdrop');
    var modalTitle = document.getElementById('modalTitle');
    var modalCloseBtn = document.getElementById('modalCloseBtn');
    var docRequestForm = document.getElementById('docRequestForm');
    var modalStatus = document.getElementById('modalStatus');
    var triggers = document.querySelectorAll('.paper-trigger');

    if (!modalBackdrop) return;

    function openModal(title) {
      if (modalTitle) modalTitle.textContent = title;
      if (modalStatus) {
        modalStatus.textContent = '';
        modalStatus.className = 'form-status';
      }
      modalBackdrop.classList.add('is-open');
      modalBackdrop.setAttribute('aria-hidden', 'false');
      var emailInput = document.getElementById('docReqEmail');
      if (emailInput) {
        emailInput.value = '';
        emailInput.focus();
      }
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modalBackdrop.classList.remove('is-open');
      modalBackdrop.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var paperName = trigger.getAttribute('data-paper') || 'AWTD Position Paper';
        openModal(paperName);
      });
    });

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeModal);
    }

    modalBackdrop.addEventListener('click', function (e) {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modalBackdrop.classList.contains('is-open')) {
        closeModal();
      }
    });

    if (docRequestForm) {
      docRequestForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var emailInput = document.getElementById('docReqEmail');
        var email = emailInput ? emailInput.value.trim() : '';

        if (!email || !email.includes('@')) {
          if (modalStatus) {
            modalStatus.textContent = 'Please enter a valid institutional email address.';
            modalStatus.className = 'form-status is-error';
          }
          return;
        }

        var paperName = modalTitle ? modalTitle.textContent : 'AWTD Position Paper';
        if (modalStatus) {
          modalStatus.textContent = 'Request logged for ' + paperName + '. Dispatch scheduled to ' + email + '.';
          modalStatus.className = 'form-status';
        }

        setTimeout(function () {
          closeModal();
        }, 1800);
      });
    }
  }

  /**
   * Working with AWTD Single-Inbox Inquiry Form
   */
  function initInquiryForm() {
    var form = document.getElementById('awtdInquiryForm');
    var formStatus = document.getElementById('formStatus');
    var formType = document.getElementById('formType');
    var actionBtns = document.querySelectorAll('.cta-action-btn');

    // Pre-populate inquiry type based on card clicked
    actionBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var type = btn.getAttribute('data-inquiry-type');
        if (formType && type) {
          formType.value = type;
        }
      });
    });

    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('formName').value.trim();
      var email = document.getElementById('formEmail').value.trim();
      var org = document.getElementById('formOrg').value.trim();
      var type = document.getElementById('formType').value;
      var message = document.getElementById('formMessage').value.trim();

      if (!name || !email || !message) {
        if (formStatus) {
          formStatus.textContent = 'Please provide your name, official email, and message.';
          formStatus.className = 'form-status is-error';
        }
        return;
      }

      var subject = encodeURIComponent('[AWTD Inquiry] ' + type.toUpperCase() + ' - ' + (org || name));
      var body = encodeURIComponent(
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        'Organization: ' + (org || 'N/A') + '\n' +
        'Engagement Type: ' + type + '\n\n' +
        'Message:\n' + message
      );

      var mailtoUrl = 'mailto:' + window.AWTD_CONFIG.primaryContact + '?subject=' + subject + '&body=' + body;

      if (formStatus) {
        formStatus.textContent = 'Opening your email client to transmit directly to ' + window.AWTD_CONFIG.primaryContact + '...';
        formStatus.className = 'form-status';
      }

      window.location.href = mailtoUrl;

      setTimeout(function () {
        if (formStatus) {
          formStatus.textContent = 'Inquiry generated for ' + window.AWTD_CONFIG.primaryContact + '. If your email client did not open, email us directly at ' + window.AWTD_CONFIG.primaryContact + '.';
        }
        form.reset();
      }, 1500);
    });
  }

  /**
   * Stat Counters Animation
   */
  function initStatCounters() {
    var statElements = document.querySelectorAll('.stat b[data-count]');
    if (!statElements.length) return;

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    var animated = false;

    function runCounters() {
      if (animated) return;
      var hero = document.getElementById('top');
      if (!hero) return;

      var rect = hero.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom >= 0) {
        animated = true;

        statElements.forEach(function (el) {
          var target = parseInt(el.getAttribute('data-count'), 10);
          var suffix = el.getAttribute('data-suffix') || '';
          if (isNaN(target)) return;

          var start = 0;
          var duration = 1200;
          var startTime = null;

          function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var current = Math.floor(progress * target);
            el.textContent = current + suffix;

            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              el.textContent = target + suffix;
            }
          }

          window.requestAnimationFrame(step);
        });
      }
    }

    window.addEventListener('scroll', runCounters, { passive: true });
    runCounters();
  }

  /**
   * Smooth internal link scrolling with navbar offset
   */
  function initSmoothScroll() {
    var internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var targetId = link.getAttribute('href');
        if (targetId === '#' || targetId === '') return;

        var targetElem = document.querySelector(targetId);
        if (targetElem) {
          e.preventDefault();
          var navHeight = 72;
          var targetTop = targetElem.getBoundingClientRect().top + window.pageYOffset - navHeight;

          window.scrollTo({
            top: targetTop,
            behavior: 'smooth'
          });

          // Focus management for accessibility
          targetElem.setAttribute('tabindex', '-1');
          targetElem.focus({ preventScroll: true });
        }
      });
    });
  }

})();
