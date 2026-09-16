document.documentElement.classList.add('motion-ready');

/**
 * ATOSWEB — Hero Section Interactions
 * Lightweight, accessible and performant
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const initialLoader = document.getElementById('initialLoader');

  if (initialLoader) {
    const hasSeenIntro = document.documentElement.classList.contains('intro-seen');

    if (hasSeenIntro) {
      initialLoader.remove();
    } else {
      document.documentElement.classList.add('intro-playing');

      try {
        sessionStorage.setItem('atosweb-intro-seen', 'true');
      } catch (error) {
        // The intro still works when storage is unavailable.
      }

      const exitDelay = prefersReducedMotion ? 90 : 850;
      const exitDuration = prefersReducedMotion ? 220 : 280;

      window.setTimeout(() => {
        initialLoader.classList.add('is-leaving');
        document.documentElement.classList.remove('intro-playing');
        document.documentElement.classList.add('intro-seen');

        window.setTimeout(() => initialLoader.remove(), exitDuration);
      }, exitDelay);
    }
  }

  // 1. Global motion system: reveal elements once, using only opacity and transform.
  const revealPlan = [
    ['.section-positioning .section-eyebrow-container', 0, 0],
    ['.section-positioning .positioning-title .title-line', 90, 80],
    ['.section-positioning .positioning-description', 0, 240],
    ['.section-positioning .feature-item', 80, 330],
    ['.section-positioning .positioning-bg-wrapper', 0, 100, 'visual'],
    ['.showcase-info', 0, 0],
    ['.showcase-actions', 0, 120],
    ['.project-card', 95, 220],
    ['.offer-content', 0, 0],
    ['.offer-panel', 0, 100, 'right'],
    ['.audience-card, .principle-card', 70, 260],
    ['.process-eyebrow, .process-title, .process-description, .process-badges', 90, 0],
    ['.process-step', 105, 220],
    ['.investment-eyebrow, .investment-title, .investment-header > p', 90, 0],
    ['.price-card', 0, 170, 'scale'],
    ['.investment-action', 0, 270],
    ['.faq-eyebrow, .faq-title, .faq-description, .faq-assurance', 105, 0, 'left'],
    ['.faq-item', 85, 150, 'right'],
    ['.faq-footer', 0, 330],
    ['.final-cta-eyebrow, .final-cta-title, .final-cta-description, .final-cta-badges, .final-micro-benefits, .final-signature', 90, 0, 'left'],
    ['.quote-card', 0, 130, 'right'],
    ['.quote-steps li', 85, 300],
    ['.site-footer .footer-brand, .site-footer .footer-nav, .site-footer .footer-contact, .site-footer .footer-bottom', 90, 0]
  ];

  revealPlan.forEach(([selector, stagger, startDelay, direction]) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      if (element.hasAttribute('data-reveal')) return;
      element.setAttribute('data-reveal', '');
      element.dataset.revealDelay = String(startDelay + (index * stagger));
      if (direction) element.dataset.revealDirection = direction;
    });
  });

  const revealElements = document.querySelectorAll('[data-reveal]');

  revealElements.forEach(element => {
    const delay = Number.parseInt(element.dataset.revealDelay || '0', 10);
    element.style.setProperty('--reveal-delay', `${Math.max(0, delay)}ms`);
  });

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach(element => element.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, {
      threshold: 0.18,
      rootMargin: '0px 0px -8% 0px'
    });

    revealElements.forEach(element => revealObserver.observe(element));
    window.addEventListener('pagehide', () => revealObserver.disconnect(), { once: true });
  }

  const processJourney = document.querySelector('.process-journey');
  if (processJourney) {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      processJourney.classList.add('is-drawn');
    } else {
      const processObserver = new IntersectionObserver(([entry], observer) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-drawn');
        observer.unobserve(entry.target);
      }, { threshold: 0.22 });
      processObserver.observe(processJourney);
    }
  }

  // Portfolio: local, low-intensity pointer highlight. No document-level tracking.
  const precisePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const projectCards = document.querySelectorAll('.project-card');
  const localInteractionController = new AbortController();

  if (precisePointer.matches && !prefersReducedMotion) {
    projectCards.forEach(card => {
      let frame = 0;
      let latestEvent;

      card.addEventListener('pointermove', event => {
        latestEvent = event;
        if (frame) return;
        frame = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty('--card-pointer-x', `${latestEvent.clientX - rect.left}px`);
          card.style.setProperty('--card-pointer-y', `${latestEvent.clientY - rect.top}px`);
          frame = 0;
        });
      }, { signal: localInteractionController.signal, passive: true });

      card.addEventListener('pointerenter', () => card.classList.add('has-pointer'), {
        signal: localInteractionController.signal
      });

      card.addEventListener('pointerleave', () => {
        card.classList.remove('has-pointer');
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
      }, { signal: localInteractionController.signal });
    });
  }

  window.addEventListener('pagehide', () => localInteractionController.abort(), { once: true });

  // 2. Header entrance and scrolled state without running work on every scroll frame.
  const header = document.getElementById('siteHeader');
  const headerSentinel = document.querySelector('.header-scroll-sentinel');

  requestAnimationFrame(() => header?.classList.add('is-ready'));

  if (header && headerSentinel && 'IntersectionObserver' in window) {
    const headerObserver = new IntersectionObserver(([entry]) => {
      header.classList.toggle('scrolled', !entry.isIntersecting);
    });
    headerObserver.observe(headerSentinel);
    window.addEventListener('pagehide', () => headerObserver.disconnect(), { once: true });
  } else if (header) {
    header.classList.toggle('scrolled', window.scrollY > 24);
  }

  // 3. Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  
  if (mobileToggle && mobileDrawer) {
    const getDrawerFocusable = () => [...mobileDrawer.querySelectorAll('a, button:not([disabled])')];

    const setMenuState = (isOpen, returnFocus = false) => {
      mobileDrawer.classList.toggle('open', isOpen);
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      mobileToggle.setAttribute('aria-label', isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
      document.body.classList.toggle('menu-open', isOpen);

      if (isOpen) {
        requestAnimationFrame(() => getDrawerFocusable()[0]?.focus());
      } else if (returnFocus) {
        mobileToggle.focus();
      }
    };

    mobileToggle.addEventListener('click', () => {
      setMenuState(!mobileDrawer.classList.contains('open'));
    });

    // Close mobile drawer when clicking a link
    const mobileLinks = mobileDrawer.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        const target = link.hash ? document.querySelector(link.hash) : null;
        setMenuState(false);

        if (target instanceof HTMLElement) {
          target.setAttribute('tabindex', '-1');
          requestAnimationFrame(() => target.focus({ preventScroll: true }));
        }
      });
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        setMenuState(false, true);
        return;
      }

      if (event.key === 'Tab' && mobileDrawer.classList.contains('open')) {
        const focusable = getDrawerFocusable();
        const first = focusable[0];
        const last = focusable.at(-1);

        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }

  // 4. Portfolio Filter Pills
  const filterPills = document.querySelectorAll('.filter-pill');
  filterPills.forEach(pill => {
    const filterValue = pill.getAttribute('data-filter');
    const hasProjects = filterValue === 'all' || [...projectCards].some(card => card.dataset.category === filterValue);

    if (!hasProjects) {
      pill.hidden = true;
      return;
    }

    pill.addEventListener('click', () => {
      filterPills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 5. FAQ accordion
  const accordion = document.querySelector('[data-accordion]');
  if (accordion) {
    const faqItems = accordion.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
      const trigger = item.querySelector('.faq-trigger');

      trigger.addEventListener('click', () => {
        const willOpen = !item.classList.contains('is-open');

        faqItems.forEach(faqItem => {
          faqItem.classList.remove('is-open');
          faqItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
        });

        if (willOpen) {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }
});
