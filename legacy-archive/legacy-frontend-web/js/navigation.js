// ============================================
// Navigation — The Gió Riverside Style
// Transparent nav → solid on scroll
// ============================================
(function() {
  // Smooth scroll for nav links
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      document.querySelector('.topbar-nav')?.classList.remove('open');
    }
  });

  // Active section tracking + transparent nav on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.topbar-nav a');
  const topbar = document.querySelector('.topbar');

  function onScroll() {
    const scrollY = window.scrollY;
    
    // Transparent → solid nav (thegio.vn style)
    if (topbar) {
      topbar.classList.toggle('scrolled', scrollY > 80);
    }

    // Active nav tracking
    const offset = 150;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      
      if (scrollY + offset >= top && scrollY + offset < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });

    // Scroll progress bar
    const bar = document.querySelector('.scroll-progress');
    if (bar) {
      const total = document.body.scrollHeight - window.innerHeight;
      bar.style.width = (total > 0 ? (scrollY / total) * 100 : 0) + '%';
    }
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { onScroll(); ticking = false; });
      ticking = true;
    }
  });

  // Mobile menu toggle
  window.toggleMobileMenu = function() {
    document.querySelector('.topbar-nav')?.classList.toggle('open');
  };

  // Initial
  onScroll();
})();
