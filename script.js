/**
 * ATOSWEB — Hero Section Interactions
 * Lightweight, accessible and performant
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll effect
  const header = document.getElementById('siteHeader');
  
  const handleScroll = () => {
    if (window.scrollY > 24) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Video Playback Guarantee
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    // Attempt play
    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy prevented playback, video will show poster fallback
        console.log('Autoplay was prevented by browser policy.');
      });
    }
  }

  // 3. Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        mobileDrawer.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      } else {
        mobileDrawer.classList.add('open');
        mobileToggle.classList.add('active');
        mobileToggle.setAttribute('aria-expanded', 'true');
      }
    });

    // Close mobile drawer when clicking a link
    const mobileLinks = mobileDrawer.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 4. Subtle Button Magnetic Glow / Mouse Move Effect
  const primaryBtn = document.querySelector('.btn-primary');
  if (primaryBtn) {
    primaryBtn.addEventListener('mousemove', (e) => {
      const rect = primaryBtn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      primaryBtn.style.setProperty('--mouse-x', `${x}px`);
      primaryBtn.style.setProperty('--mouse-y', `${y}px`);
    });
  }
});
