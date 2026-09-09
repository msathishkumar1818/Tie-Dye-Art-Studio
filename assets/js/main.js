/**
 * BATIK & TIE-DYE ART STUDIO — MASTER JAVASCRIPT
 * Handles Theme, RTL/LTR Direction, Home Dropdowns, Mobile Drawer, 
 * 3D Card Tilt, Back to Top, Page Loader, Section Animations, Modals, Filters & Toasts
 */

document.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
  initTheme();
  initDirection();
  initHeader();
  initHomeDropdown();
  initMobileDrawer();
  initBackToTop();
  initScrollAnimations();
  initHeroFabric3D();
  init3DTiltCards();
  initModals();
  initAccordions();
  initColorSwatches();
  initProductFilters();
  initCustomOrderEstimator();
  initFormSubmissions();
  initLocationMap3D();
  initGalleryPage();
});

/* ==========================================================================
   1. FAST BRAND PAGE LOADER
   ========================================================================== */
function initPageLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  const hideLoader = () => {
    loader.classList.add('loader-hidden');
  };

  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 100);
  } else {
    window.addEventListener('load', () => setTimeout(hideLoader, 100));
    setTimeout(hideLoader, 450); // Fail-safe ceiling
  }
}

/* ==========================================================================
   2. THEME MANAGEMENT (Light / Dark Mode Synchronized)
   ========================================================================== */
function initTheme() {
  const savedTheme = localStorage.getItem('art_studio_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  updateThemeToggleIcons();

  const toggleButtons = document.querySelectorAll('.theme-toggle-btn, .drawer-theme-toggle, #fixed-theme-toggle');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('art_studio_theme', isDark ? 'dark' : 'light');
      updateThemeToggleIcons();
      showToast(isDark ? '🌙 Switched to Dark Studio Mode' : '☀️ Switched to Sunlit Light Mode', 'info');
    });
  });
}

function updateThemeToggleIcons() {
  const isDark = document.documentElement.classList.contains('dark');
  
  // Update header and fixed floating icon buttons
  const iconButtons = document.querySelectorAll('.theme-toggle-btn:not(.drawer-utility-btn), #fixed-theme-toggle');
  iconButtons.forEach(btn => {
    btn.innerHTML = isDark 
      ? `<svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`
      : `<svg class="w-5 h-5 text-slate-700 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`;
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  });

  // Update mobile drawer theme controls
  const themeLabels = document.querySelectorAll('.theme-mode-label');
  themeLabels.forEach(lbl => {
    lbl.textContent = isDark ? 'Dark Studio Mode' : 'Sunlit Light Mode';
  });

  const themeIcons = document.querySelectorAll('.theme-drawer-icon');
  themeIcons.forEach(icon => {
    icon.innerHTML = isDark
      ? `<svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`
      : `<svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`;
  });
}

/* ==========================================================================
   3. RTL / LTR DIRECTION SWITCHER (Synchronized)
   ========================================================================== */
function initDirection() {
  const savedDir = localStorage.getItem('art_studio_dir') || 'ltr';
  document.documentElement.setAttribute('dir', savedDir);
  updateRTLButtons(savedDir);

  const rtlButtons = document.querySelectorAll('.rtl-toggle-btn, .drawer-rtl-toggle');
  rtlButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      
      document.documentElement.setAttribute('dir', newDir);
      localStorage.setItem('art_studio_dir', newDir);
      updateRTLButtons(newDir);
      showToast(newDir === 'rtl' ? '🔄 Direction changed to RTL' : '🔄 Direction changed to LTR', 'info');
    });
  });
}

function updateRTLButtons(dir) {
  const isRtl = dir === 'rtl';

  // Desktop RTL action buttons
  const rtlButtons = document.querySelectorAll('.header-actions .rtl-toggle-btn');
  rtlButtons.forEach(btn => {
    btn.innerHTML = isRtl
      ? `<span class="font-bold">LTR</span>`
      : `<span class="font-bold">RTL</span>`;
    btn.setAttribute('aria-label', isRtl ? 'Switch to LTR' : 'Switch to RTL');
  });

  // Mobile drawer RTL controls
  const rtlLabels = document.querySelectorAll('.rtl-mode-label');
  rtlLabels.forEach(lbl => {
    lbl.textContent = isRtl ? 'Right to Left (RTL)' : 'Left to Right (LTR)';
  });

  const rtlBadges = document.querySelectorAll('.rtl-badge-text');
  rtlBadges.forEach(badge => {
    badge.textContent = isRtl ? 'LTR' : 'RTL';
  });
}

/* ==========================================================================
   4. STICKY HEADER & ACTIVE NAVIGATION
   ========================================================================== */
function initHeader() {
  const header = document.getElementById('main-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // Active link detection for Desktop and Mobile Navigation
  let currentPath = window.location.pathname.split('/').pop() || 'index.html';
  if (currentPath === '' || currentPath.endsWith('/') || currentPath.includes('Tie-Dye Art Studio')) {
    // If running in local directory without filename or root
    if (window.location.pathname.includes('home-2.html')) {
      currentPath = 'home-2.html';
    } else {
      currentPath = 'index.html';
    }
  }

  const isHome1 = (currentPath === 'index.html');
  const isHome2 = (currentPath === 'home-2.html');
  const isHome = isHome1 || isHome2;

  // 1. Highlight Top-Level Home Dropdown Triggers (Desktop & Mobile)
  const desktopHomeTrigger = document.querySelector('.nav-dropdown-trigger');
  const mobileHomeToggle = document.querySelector('.drawer-dropdown-toggle');
  
  if (isHome) {
    if (desktopHomeTrigger) desktopHomeTrigger.classList.add('active');
    if (mobileHomeToggle) mobileHomeToggle.classList.add('active');
  } else {
    if (desktopHomeTrigger) desktopHomeTrigger.classList.remove('active');
    if (mobileHomeToggle) mobileHomeToggle.classList.remove('active');
  }

  // 2. Highlight Specific Home Sublinks & Dropdown Items
  document.querySelectorAll('a[href="index.html"].dropdown-item-link, a[href="index.html"].drawer-sublink').forEach(el => {
    if (isHome1) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });

  document.querySelectorAll('a[href="home-2.html"].dropdown-item-link, a[href="home-2.html"].drawer-sublink').forEach(el => {
    if (isHome2) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });

  // 3. Highlight Other Pages (Gallery, Products, Workshops, Custom Orders, Contact)
  const otherNavLinks = document.querySelectorAll('.nav-link:not(.nav-dropdown-trigger), .drawer-link:not(.drawer-dropdown-toggle)');
  otherNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href !== '#' && !href.startsWith('#')) {
      if (href === currentPath) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
}

/* ==========================================================================
   5. NAVIGATION & DROPDOWN STATE MANAGEMENT (Desktop & Mobile)
   ========================================================================== */
let mobileMenuOpen = false;
let homeDropdownOpen = false;
let mobileHomeSubmenuOpen = false;

function openHomeDropdown() {
  const dropdownWrappers = document.querySelectorAll('.nav-dropdown-wrapper');
  dropdownWrappers.forEach(wrap => {
    wrap.classList.add('open');
    const trigger = wrap.querySelector('.nav-dropdown-trigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
  });
  homeDropdownOpen = true;
}

function closeHomeDropdown() {
  const dropdownWrappers = document.querySelectorAll('.nav-dropdown-wrapper');
  dropdownWrappers.forEach(wrap => {
    wrap.classList.remove('open');
    const trigger = wrap.querySelector('.nav-dropdown-trigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  });
  homeDropdownOpen = false;
}

function toggleHomeDropdown() {
  if (homeDropdownOpen) {
    closeHomeDropdown();
  } else {
    openHomeDropdown();
  }
}

function openMobileHomeSubmenu() {
  const mobileSubmenu = document.querySelector('.drawer-submenu');
  const mobileHomeToggle = document.querySelector('.drawer-dropdown-toggle');
  if (mobileSubmenu) {
    mobileSubmenu.classList.add('open');
  }
  if (mobileHomeToggle) {
    const arrow = mobileHomeToggle.querySelector('.dropdown-chevron');
    if (arrow) arrow.style.transform = 'rotate(180deg)';
  }
  mobileHomeSubmenuOpen = true;
}

function closeMobileHomeSubmenu() {
  const mobileSubmenu = document.querySelector('.drawer-submenu');
  const mobileHomeToggle = document.querySelector('.drawer-dropdown-toggle');
  if (mobileSubmenu) {
    mobileSubmenu.classList.remove('open');
  }
  if (mobileHomeToggle) {
    const arrow = mobileHomeToggle.querySelector('.dropdown-chevron');
    if (arrow) arrow.style.transform = 'rotate(0deg)';
  }
  mobileHomeSubmenuOpen = false;
}

function toggleMobileHomeSubmenu() {
  if (mobileHomeSubmenuOpen) {
    closeMobileHomeSubmenu();
  } else {
    openMobileHomeSubmenu();
  }
}

function openMobileMenu() {
  const drawer = document.getElementById('mobile-drawer');
  const openBtn = document.querySelector('.mobile-menu-toggle');
  if (!drawer) return;

  // Home dropdown starts closed when opening mobile menu unless explicitly tapped (Requirement 6)
  closeMobileHomeSubmenu();

  mobileMenuOpen = true;
  drawer.classList.add('open');
  document.body.classList.add('mobile-nav-open');
  document.body.style.overflow = 'hidden';
  if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
}

function closeMobileMenu() {
  const drawer = document.getElementById('mobile-drawer');
  const openBtn = document.querySelector('.mobile-menu-toggle');
  if (!drawer) return;

  mobileMenuOpen = false;
  drawer.classList.remove('open');
  document.body.classList.remove('mobile-nav-open');
  document.body.style.overflow = '';
  if (openBtn) openBtn.setAttribute('aria-expanded', 'false');

  // Automatically reset mobile home submenu state when drawer closes
  closeMobileHomeSubmenu();
}

function toggleMobileMenu() {
  if (mobileMenuOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

function closeAllNavigation() {
  closeHomeDropdown();
  closeMobileMenu();
}

function initHomeDropdown() {
  // Mobile Home Accordion toggle
  const mobileHomeToggle = document.querySelector('.drawer-dropdown-toggle');
  if (mobileHomeToggle) {
    mobileHomeToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleMobileHomeSubmenu();
    });
  }

  // Desktop Click toggle support
  const dropdownWrappers = document.querySelectorAll('.nav-dropdown-wrapper');
  dropdownWrappers.forEach(wrap => {
    const trigger = wrap.querySelector('.nav-dropdown-trigger');
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        if (window.innerWidth >= 1200) {
          e.preventDefault();
          e.stopPropagation();
          toggleHomeDropdown();
        }
      });
    }
  });

  // Close desktop dropdown when clicking dropdown items (Home 1, Home 2)
  document.querySelectorAll('.dropdown-item-link').forEach(item => {
    item.addEventListener('click', () => {
      closeHomeDropdown();
    });
  });

  // Close desktop dropdown when clicking other navigation links
  document.querySelectorAll('.desktop-nav .nav-link:not(.nav-dropdown-trigger)').forEach(link => {
    link.addEventListener('click', () => {
      closeHomeDropdown();
    });
  });

  // Close desktop dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown-wrapper')) {
      closeHomeDropdown();
    }
  });
}

/* ==========================================================================
   6. MOBILE NAVIGATION DRAWER & MENU BUTTON
   ========================================================================== */
function initMobileDrawer() {
  const drawer = document.getElementById('mobile-drawer');
  const openBtn = document.querySelector('.mobile-menu-toggle');
  const closeBtn = document.querySelector('.drawer-close-btn');
  const backdrop = document.querySelector('.drawer-backdrop');
  
  if (!drawer || !openBtn) return;

  openBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMobileMenu();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMobileMenu();
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMobileMenu();
    });
  }

  // Close drawer immediately on any navigation link click (Home 1, Home 2, Products, Workshops, Custom Orders, Contact, CTA, Brand)
  document.querySelectorAll('.drawer-link:not(.drawer-dropdown-toggle), .drawer-sublink, .drawer-cta-wrap a, .drawer-brand-wrap').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Ensure drawer is cleanly closed on page load and bfcache restore
  closeMobileMenu();
  window.addEventListener('pageshow', () => {
    closeMobileMenu();
  });

  // Global Escape key handler
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllNavigation();
    }
  });

  // Auto-close on viewport resize to desktop (>= 1200px)
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1200) {
      if (mobileMenuOpen) closeMobileMenu();
    } else {
      if (homeDropdownOpen) closeHomeDropdown();
    }
  }, { passive: true });
}

/* ==========================================================================
   7. FLOATING BACK TO TOP BUTTON (UP ARROW)
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   8. SECTION SCROLL ANIMATIONS (IntersectionObserver)
   ========================================================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll(
    '.scroll-reveal-up, .scroll-reveal-left, .scroll-reveal-right, .mask-reveal-clip, .stagger-parent'
  );

  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        
        // Trigger numerical counter if present
        const counter = entry.target.querySelector('[data-target-counter]');
        if (counter && !counter.classList.contains('counted')) {
          animateCounter(counter);
        }

        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -20px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  el.classList.add('counted');
  const target = parseInt(el.getAttribute('data-target-counter'), 10) || 100;
  const duration = 1400;
  const start = 0;
  const startTime = performance.now();

  function update(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (target - start) * easeOut);
    el.textContent = current + (el.getAttribute('data-counter-suffix') || '');
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* ==========================================================================
   9. HERO 3D FLOATING TEXTILE / FABRIC DEPTH CONTROLLER (Home 1)
   Continuous fluid lerp mouse physics, dynamic specular sheen & organic cast shadow
   ========================================================================== */
function initHeroFabric3D() {
  const viewport = document.getElementById('hero-fabric-viewport');
  const stage = document.getElementById('hero-fabric-stage');
  const shadow = document.getElementById('hero-fabric-shadow');
  const aura = document.getElementById('hero-fabric-aura');
  const sheen = document.getElementById('hero-fabric-sheen');
  
  if (!viewport || !stage) return;

  // 1. Trigger 3D Perspective Entrance on Scroll/Load
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        stage.classList.add('hero-fabric-entrance');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  observer.observe(viewport);

  // 2. Desktop 3D Mouse Parallax Physics with Smooth Linear Interpolation (Lerp)
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && window.innerWidth >= 1200) {
    let targetRotateX = 0;
    let targetRotateY = 0;
    let targetRotateZ = 0;
    let targetShadowX = 0;
    let targetShadowY = 32;
    let targetAuraX = 0;
    let targetAuraY = 0;
    let targetSheenX = 40;
    let targetSheenY = 30;

    let currentRotateX = 0;
    let currentRotateY = 0;
    let currentRotateZ = 0;
    let currentShadowX = 0;
    let currentShadowY = 32;
    let currentAuraX = 0;
    let currentAuraY = 0;
    let currentSheenX = 40;
    let currentSheenY = 30;

    let isHovering = false;
    let animFrameId = null;

    const heroSection = document.getElementById('hero-home') || viewport;

    function onMouseMove(e) {
      const rect = viewport.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalized coordinates (-1 to 1) relative to viewport center
      const normX = Math.max(-1.2, Math.min(1.2, (e.clientX - centerX) / (rect.width / 2)));
      const normY = Math.max(-1.2, Math.min(1.2, (e.clientY - centerY) / (rect.height / 2)));

      // Subtle, refined 3D rotations (turns toward mouse)
      targetRotateY = normX * 8.5;  // max ±8.5 deg Y-rotation
      targetRotateX = -normY * 7.5; // max ∓7.5 deg X-rotation
      targetRotateZ = normX * 1.2;  // subtle roll

      // Directional cast shadow shifts opposite to virtual light
      targetShadowX = -normX * 22;
      targetShadowY = 32 - normY * 14;

      // Aura follows slightly for atmospheric depth
      targetAuraX = normX * 16;
      targetAuraY = normY * 16;

      // Specular sheen highlight follows light reflection
      targetSheenX = 40 + normX * 28;
      targetSheenY = 30 + normY * 22;

      if (!isHovering) {
        isHovering = true;
        if (!animFrameId) {
          animFrameId = requestAnimationFrame(render);
        }
      }
    }

    function onMouseLeave() {
      isHovering = false;
      targetRotateX = 0;
      targetRotateY = 0;
      targetRotateZ = 0;
      targetShadowX = 0;
      targetShadowY = 32;
      targetAuraX = 0;
      targetAuraY = 0;
      targetSheenX = 40;
      targetSheenY = 30;
      if (!animFrameId) {
        animFrameId = requestAnimationFrame(render);
      }
    }

    function render() {
      // Lerp factor: 0.08 for buttery-smooth non-snapping organic fabric movement
      const lerp = 0.08;
      currentRotateX += (targetRotateX - currentRotateX) * lerp;
      currentRotateY += (targetRotateY - currentRotateY) * lerp;
      currentRotateZ += (targetRotateZ - currentRotateZ) * lerp;
      currentShadowX += (targetShadowX - currentShadowX) * lerp;
      currentShadowY += (targetShadowY - currentShadowY) * lerp;
      currentAuraX += (targetAuraX - currentAuraX) * lerp;
      currentAuraY += (targetAuraY - currentAuraY) * lerp;
      currentSheenX += (targetSheenX - currentSheenX) * lerp;
      currentSheenY += (targetSheenY - currentSheenY) * lerp;

      // Apply 3D matrix transform to stage
      stage.style.transform = `perspective(1200px) rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg) rotateZ(${currentRotateZ.toFixed(2)}deg) translateZ(10px)`;

      // Apply dynamic shadow offset
      if (shadow) {
        shadow.style.transform = `translate3d(${currentShadowX.toFixed(1)}px, ${currentShadowY.toFixed(1)}px, -35px)`;
      }

      // Apply ambient aura offset
      if (aura) {
        aura.style.transform = `translate3d(${currentAuraX.toFixed(1)}px, ${currentAuraY.toFixed(1)}px, -50px)`;
      }

      // Apply specular sheen position
      if (sheen) {
        sheen.style.background = `radial-gradient(circle at ${currentSheenX.toFixed(1)}% ${currentSheenY.toFixed(1)}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 75%)`;
      }

      // Continue render loop if still moving or hovering
      const isSettled = !isHovering && 
        Math.abs(currentRotateX) < 0.02 && 
        Math.abs(currentRotateY) < 0.02 &&
        Math.abs(currentShadowX) < 0.02;

      if (!isSettled) {
        animFrameId = requestAnimationFrame(render);
      } else {
        animFrameId = null;
        stage.style.transform = '';
      }
    }

    heroSection.addEventListener('mousemove', onMouseMove, { passive: true });
    heroSection.addEventListener('mouseleave', onMouseLeave, { passive: true });
  }
}

/* ==========================================================================
   10. 3D INTERACTIVE CARD TILT CONTROLLER
   ========================================================================== */
function init3DTiltCards() {
  const tiltCards = document.querySelectorAll('.tilt-card-3d');
  if (!tiltCards.length) return;

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      });
    });
  }
}

/* ==========================================================================
   10. MODALS & POPUPS
   ========================================================================== */
function initModals() {
  const modalTriggers = document.querySelectorAll('[data-open-modal]');
  const closeTriggers = document.querySelectorAll('[data-close-modal]');
  const modals = document.querySelectorAll('.art-modal');

  modalTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute('data-open-modal');
      const targetModal = document.getElementById(modalId);
      
      if (targetModal) {
        const courseName = btn.getAttribute('data-course-name');
        if (courseName) {
          const select = targetModal.querySelector('#modal-workshop-select');
          if (select) select.value = courseName;
        }
        
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      modals.forEach(m => m.classList.remove('active'));
      document.body.style.overflow = '';
    });
  });

  modals.forEach(modal => {
    const backdrop = modal.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach(m => m.classList.remove('active'));
      document.body.style.overflow = '';
    }
  });
}

/* ==========================================================================
   11. ACCORDIONS (FAQ)
   ========================================================================== */
function initAccordions() {
  const accordions = document.querySelectorAll('.accordion-item');
  
  accordions.forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      const parent = item.closest('.accordion-group');
      if (parent) {
        parent.querySelectorAll('.accordion-item').forEach(other => {
          if (other !== item) other.classList.remove('active');
        });
      }
      item.classList.toggle('active', !isActive);
    });
  });
}

/* ==========================================================================
   12. COLOR SWATCHES & STORY SWITCHER
   ========================================================================== */
function initColorSwatches() {
  const swatchButtons = document.querySelectorAll('.color-story-swatch');
  
  swatchButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const storyId = btn.getAttribute('data-story');
      const container = btn.closest('.color-story-container');
      
      if (container) {
        container.querySelectorAll('.color-story-swatch').forEach(s => s.classList.remove('active'));
        btn.classList.add('active');

        container.querySelectorAll('.color-story-panel').forEach(panel => {
          if (panel.getAttribute('data-story-panel') === storyId) {
            panel.classList.remove('hidden');
            panel.classList.add('flex');
          } else {
            panel.classList.add('hidden');
            panel.classList.remove('flex');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   13. PRODUCTS FILTERING
   ========================================================================== */
function initProductFilters() {
  const filterBtns = document.querySelectorAll('.product-filter-btn');
  const productCards = document.querySelectorAll('.product-item-card');
  
  if (!filterBtns.length || !productCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active', 'bg-indigo-900', 'text-white');
        b.classList.add('bg-sand', 'text-slate-800');
      });
      
      btn.classList.add('active', 'bg-indigo-900', 'text-white');
      btn.classList.remove('bg-sand', 'text-slate-800');

      const filter = btn.getAttribute('data-filter');

      productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}

/* ==========================================================================
   14. CUSTOM ORDER ESTIMATOR
   ========================================================================== */
function initCustomOrderEstimator() {
  const form = document.getElementById('custom-estimator-form');
  if (!form) return;

  const fabricSelect = form.querySelector('#estimate-fabric');
  const techniqueSelect = form.querySelector('#estimate-technique');
  const sizeSelect = form.querySelector('#estimate-size');
  const priceDisplay = document.getElementById('estimate-price-output');
  const timeDisplay = document.getElementById('estimate-time-output');

  function calculate() {
    if (!fabricSelect || !techniqueSelect || !sizeSelect || !priceDisplay || !timeDisplay) return;

    const baseFabricPrices = { silk: 180, linen: 140, cotton: 95, wool: 210 };
    const techniqueMultipliers = { canting: 1.5, shibori: 1.25, icedye: 1.1, layered: 1.6 };
    const sizeMultipliers = { scarf: 1.0, garment: 1.8, cushion: 0.9, tapestry: 2.4, largeart: 3.5 };
    const leadTimes = { scarf: '2-3 Weeks', garment: '3-4 Weeks', cushion: '2 Weeks', tapestry: '4-5 Weeks', largeart: '5-6 Weeks' };

    const fabric = fabricSelect.value;
    const technique = techniqueSelect.value;
    const size = sizeSelect.value;

    const base = baseFabricPrices[fabric] || 120;
    const tech = techniqueMultipliers[technique] || 1.2;
    const sz = sizeMultipliers[size] || 1.0;

    const total = Math.round(base * tech * sz);
    priceDisplay.textContent = `$${total} – $${Math.round(total * 1.25)}`;
    timeDisplay.textContent = leadTimes[size] || '3-4 Weeks';
  }

  [fabricSelect, techniqueSelect, sizeSelect].forEach(elem => {
    if (elem) elem.addEventListener('change', calculate);
  });

  calculate();
}

/* ==========================================================================
   15. FORM SUBMISSIONS & ARTISTIC TOASTS
   ========================================================================== */
function initFormSubmissions() {
  const contactForm = document.getElementById('studio-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('[name="name"]')?.value || 'Friend';
      showToast(`✨ Thank you, ${name}! Your inquiry has been sent to Maya & the Atelier team.`, 'success');
      contactForm.reset();
    });
  }

  const bookingForm = document.getElementById('workshop-booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const workshop = bookingForm.querySelector('#modal-workshop-select')?.value || 'Workshop';
      const modal = document.getElementById('workshop-modal');
      if (modal) modal.classList.remove('active');
      document.body.style.overflow = '';
      showToast(`🎉 Reservation confirmed for ${workshop}! Check your email for dye preparation details.`, 'success');
      bookingForm.reset();
    });
  }

  const customForm = document.getElementById('custom-order-form');
  if (customForm) {
    customForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast(`🎨 Custom commission brief received! Our master artisan will review your palette within 24 hours.`, 'success');
      customForm.reset();
    });
  }

  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('💌 Welcome to the Atelier Dispatch! You will receive our monthly dye recipe & lookbook.', 'success');
      form.reset();
    });
  });
}

/* ==========================================================================
   16. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  if (type === 'success') {
    toast.style.borderLeftColor = 'var(--color-teal)';
  } else if (type === 'warning') {
    toast.style.borderLeftColor = 'var(--color-turmeric)';
  }

  toast.innerHTML = `
    <span class="text-xl">✨</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

/* ==========================================================================
   16. ATELIER LOCATION MAP 3D PERSPECTIVE CONTROLLER (Contact Page)
   Refined subtle 3D hover physics, dynamic specular sheen & cast shadow shift
   ========================================================================== */
function initLocationMap3D() {
  const viewport = document.getElementById('location-map-viewport');
  const stage = document.getElementById('location-map-stage');
  const shadow = document.getElementById('location-map-shadow');
  const aura = document.getElementById('location-map-aura');

  if (!viewport || !stage) return;

  // 1. Trigger 3D Perspective Entrance on Scroll/Load
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        stage.classList.add('map-3d-entrance');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(viewport);

  // 2. Desktop 3D Mouse Parallax Physics with Smooth Lerp
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && window.innerWidth >= 1024) {
    let targetRotateX = 0;
    let targetRotateY = 0;
    let targetShadowX = 0;
    let targetShadowY = 12;
    let targetAuraX = 0;
    let targetAuraY = 0;

    let currentRotateX = 0;
    let currentRotateY = 0;
    let currentShadowX = 0;
    let currentShadowY = 12;
    let currentAuraX = 0;
    let currentAuraY = 0;

    let isHovering = false;
    let animFrameId = null;

    function onMouseMove(e) {
      const rect = viewport.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalized coordinates (-1 to 1) relative to map center
      const normX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width / 2)));
      const normY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height / 2)));

      // Subtle, refined 3D rotations (turns slightly toward mouse)
      targetRotateY = normX * 4.5;  // max ±4.5 deg Y-rotation
      targetRotateX = -normY * 3.8; // max ∓3.8 deg X-rotation

      // Directional cast shadow shifts opposite
      targetShadowX = -normX * 14;
      targetShadowY = 12 - normY * 8;

      // Aura shifts slightly
      targetAuraX = normX * 10;
      targetAuraY = normY * 10;

      if (!isHovering) {
        isHovering = true;
        if (!animFrameId) {
          animFrameId = requestAnimationFrame(render);
        }
      }
    }

    function onMouseLeave() {
      isHovering = false;
      targetRotateX = 0;
      targetRotateY = 0;
      targetShadowX = 0;
      targetShadowY = 12;
      targetAuraX = 0;
      targetAuraY = 0;
      if (!animFrameId) {
        animFrameId = requestAnimationFrame(render);
      }
    }

    function render() {
      const lerp = 0.08;
      currentRotateX += (targetRotateX - currentRotateX) * lerp;
      currentRotateY += (targetRotateY - currentRotateY) * lerp;
      currentShadowX += (targetShadowX - currentShadowX) * lerp;
      currentShadowY += (targetShadowY - currentShadowY) * lerp;
      currentAuraX += (targetAuraX - currentAuraX) * lerp;
      currentAuraY += (targetAuraY - currentAuraY) * lerp;

      stage.style.transform = `perspective(1200px) rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg)`;

      if (shadow) {
        shadow.style.transform = `translate3d(${currentShadowX.toFixed(1)}px, ${currentShadowY.toFixed(1)}px, 0)`;
      }
      if (aura) {
        aura.style.transform = `translate3d(${currentAuraX.toFixed(1)}px, ${currentAuraY.toFixed(1)}px, 0)`;
      }

      const diff = Math.abs(targetRotateX - currentRotateX) +
                   Math.abs(targetRotateY - currentRotateY);

      if (isHovering || diff > 0.02) {
        animFrameId = requestAnimationFrame(render);
      } else {
        stage.style.transform = isHovering 
          ? `perspective(1200px) rotateX(${targetRotateX}deg) rotateY(${targetRotateY}deg)`
          : '';
        if (shadow) shadow.style.transform = 'translateY(12px)';
        if (aura) aura.style.transform = '';
        animFrameId = null;
      }
    }

    viewport.addEventListener('mousemove', onMouseMove, { passive: true });
    viewport.addEventListener('mouseleave', onMouseLeave, { passive: true });
  }
}



// <!-- ================================================================
//      SCROLL PROGRESS
//      ================================================================ -->


document.addEventListener("DOMContentLoaded", () => {

  const section =
    document.querySelector("#custom-steps");

  const progress =
    document.querySelector("#journeyProgress");


  if (!section || !progress) return;


  let ticking = false;


  function updateJourneyProgress() {

    const rect =
      section.getBoundingClientRect();

    const viewportHeight =
      window.innerHeight;


    const sectionStart =
      rect.top;

    const sectionHeight =
      rect.height;


    const visible =
      viewportHeight - sectionStart;


    let percentage =
      (visible / (sectionHeight + viewportHeight)) * 140;


    percentage =
      Math.max(
        0,
        Math.min(100, percentage)
      );


    progress.style.width =
      percentage + "%";


    ticking = false;

  }


  function requestProgressUpdate() {

    if (!ticking) {

      window.requestAnimationFrame(
        updateJourneyProgress
      );

      ticking = true;

    }

  }


  window.addEventListener(
    "scroll",
    requestProgressUpdate,
    { passive: true }
  );


  window.addEventListener(
    "resize",
    requestProgressUpdate
  );


  updateJourneyProgress();

});




// <!-- ================================================================
//      SCROLL PROGRESS SCRIPT
//      ================================================================ -->



document.addEventListener("DOMContentLoaded", () => {

  const section =
    document.querySelector("#custom-timeline");

  const progress =
    document.querySelector("#craftTimelineProgress");


  if (!section || !progress) return;


  let ticking = false;


  function updateCraftProgress() {

    const rect =
      section.getBoundingClientRect();

    const viewportHeight =
      window.innerHeight;


    const visible =
      viewportHeight - rect.top;


    const total =
      rect.height + viewportHeight;


    let percentage =
      (visible / total) * 135;


    percentage =
      Math.max(
        0,
        Math.min(100, percentage)
      );


    progress.style.width =
      percentage + "%";


    ticking = false;

  }


  function requestCraftProgress() {

    if (!ticking) {

      window.requestAnimationFrame(
        updateCraftProgress
      );

      ticking = true;

    }

  }


  window.addEventListener(
    "scroll",
    requestCraftProgress,
    { passive: true }
  );


  window.addEventListener(
    "resize",
    requestCraftProgress
  );


  updateCraftProgress();

});

/* ==========================================================================
   PAGE 06: GALLERY / TEXTILE LOOKBOOK INTERACTIVE SYSTEM
   3D Hero Parallax, Timeline Progress, Archive Tilt & Macro Lens Parallax
   ========================================================================== */
function initGalleryPage() {
  const galleryHero = document.getElementById('gallery-hero');
  if (!galleryHero) return; // Only execute on gallery.html

  // 1. Hero 3D Float Depth Tilt (Desktop)
  const heroVisual = document.querySelector('.gallery-hero-visual');
  const floatingCard = document.querySelector('.gallery-hero-floating-card');
  const heroMainFrame = document.querySelector('.gallery-hero-main-frame');

  if (heroVisual && floatingCard && window.innerWidth >= 1024) {
    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      floatingCard.style.transform = `translateZ(60px) rotate(${x * 8 - 3}deg) translate(${x * 20}px, ${y * 20}px)`;
      if (heroMainFrame) {
        heroMainFrame.style.transform = `rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
      }
    });

    heroVisual.addEventListener('mouseleave', () => {
      floatingCard.style.transform = 'translateZ(40px) rotate(-3deg)';
      if (heroMainFrame) {
        heroMainFrame.style.transform = 'translateZ(0) rotateY(0deg) rotateX(0deg)';
      }
    });
  }

  // 2. Featured Textile Parallax Scroll
  const featuredSection = document.getElementById('featured-textile');
  const featuredArtwork = document.querySelector('.featured-artwork-frame');
  const featuredCard = document.querySelector('.featured-overlap-card');

  if (featuredSection && (featuredArtwork || featuredCard)) {
    const handleFeaturedScroll = () => {
      const rect = featuredSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight && rect.bottom > 0) {
        const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
        const shiftY = (progress - 0.5) * 40;

        if (featuredArtwork && window.innerWidth >= 1024) {
          featuredArtwork.style.transform = `translateY(${-shiftY * 0.5}px) rotateY(${shiftY * 0.08}deg)`;
        }
        if (featuredCard && window.innerWidth >= 1024) {
          featuredCard.style.transform = `translateY(${shiftY * 0.8}px)`;
        }
      }
    };

    window.addEventListener('scroll', handleFeaturedScroll, { passive: true });
    handleFeaturedScroll();
  }

  // 3. Process Storyline Animated Timeline Line & Step Activation
  const storylineSection = document.getElementById('hand-to-cloth');
  const progressLine = document.querySelector('.storyline-line-progress');
  const stepCards = document.querySelectorAll('.storyline-card');

  if (storylineSection) {
    const updateStorylineProgress = () => {
      const rect = storylineSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight && rect.bottom > 0) {
        const total = rect.height + windowHeight;
        const visible = windowHeight - rect.top;
        const ratio = Math.max(0, Math.min(1, visible / (total * 0.85)));

        if (progressLine) {
          const dashOffset = 1200 - (ratio * 1200);
          progressLine.style.strokeDashoffset = dashOffset;
        }

        stepCards.forEach((card, index) => {
          const cardThreshold = (index + 0.3) / stepCards.length;
          if (ratio >= cardThreshold) {
            card.classList.add('active');
          } else {
            card.classList.remove('active');
          }
        });
      }
    };

    window.addEventListener('scroll', updateStorylineProgress, { passive: true });
    updateStorylineProgress();
  }

  // 4. Macro Texture Study Cursor Exploration (Desktop)
  const macroCards = document.querySelectorAll('.macro-card');
  macroCards.forEach((card) => {
    const img = card.querySelector('.macro-img');
    if (!img) return;

    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 1024) return;
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
      img.style.transform = `scale(1.15) translate(${x}px, ${y}px)`;
    });

    card.addEventListener('mouseleave', () => {
      img.style.transform = 'scale(1) translate(0, 0)';
    });
  });

  // 5. 3D Archive Tile Hover Effect
  const tilt3DTiles = document.querySelectorAll('.archive-interact-3d');
  tilt3DTiles.forEach((tile) => {
    tile.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 1024) return;
      const rect = tile.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const imgBox = tile.querySelector('.archive-tile-img-box');
      if (imgBox) {
        imgBox.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(20px)`;
      }
    });

    tile.addEventListener('mouseleave', () => {
      const imgBox = tile.querySelector('.archive-tile-img-box');
      if (imgBox) {
        imgBox.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0)';
      }
    });
  });
}




// <!-- =========================================================================
//      VANILLA JS — 3D MOUSE INTERACTION
//      ========================================================================= -->



document.addEventListener("DOMContentLoaded", () => {

  const tiltTile =
    document.querySelector(".archive-interact-3d");

  if (!tiltTile) return;


  const imageBox =
    tiltTile.querySelector(".archive-tile-img-box");

  if (!imageBox) return;


  const isTouchDevice =
    window.matchMedia("(hover: none)").matches;


  if (isTouchDevice) return;


  tiltTile.addEventListener("mousemove", (event) => {

    const rect =
      tiltTile.getBoundingClientRect();


    const x =
      (event.clientX - rect.left) /
      rect.width - 0.5;


    const y =
      (event.clientY - rect.top) /
      rect.height - 0.5;


    const rotateY =
      x * 7;


    const rotateX =
      y * -6;


    imageBox.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateZ(8px)
    `;

  });


  tiltTile.addEventListener("mouseleave", () => {

    imageBox.style.transform = `
      perspective(1000px)
      rotateX(0deg)
      rotateY(0deg)
      translateZ(0)
    `;

  });

});

