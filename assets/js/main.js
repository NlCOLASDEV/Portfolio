/**
 * Portfolio Core Architecture & Interactive Scripts
 * Inspired by datunashvili.com — Architectural Dark Design System
 * Persona: ნიკოლოზი — Lead UI/UX დიზაინერი & Frontend არქიტექტორი
 *
 * Features:
 *  1. Mobile Navigation (Burger Menu <= 768px: toggle on click, auto-close on link click)
 *  2. Employees Directory („თანამშრომლები“ — Strictly Read-Only GET with fetch & async/await)
 *  3. Dynamic 6-Color HSL Accent Switcher (persisted in localStorage)
 *  4. Scroll Chrome (Blurred Header on scroll, Right-Edge Scroll Progress Bar, Section Scrollspy)
 *  5. Shipped Projects Category Filter & Case Study Modal Escape Support
 *  6. Architectural Contact Form Handler
 *  7. Custom Dynamic Accent Cursor & Smooth Slow-Wheel Scrolling
 */

const EMPLOYEES_API_URL = 'https://jsonplaceholder.typicode.com/users';
const ACCENT_STORAGE_KEY = 'portfolio-accent';
const DEFAULT_ACCENT_HSL = '262 83% 70%';

const ALLOWED_ACCENTS = new Set([
  '262 83% 70%', // Violet
  '218 90% 68%', // Blue
  '188 75% 58%', // Cyan
  '158 64% 55%', // Emerald
  '40 95% 62%',  // Amber
  '328 82% 68%'  // Magenta
]);

document.addEventListener('DOMContentLoaded', () => {
  initAccentSwitcher();
  initBurgerMenu();
  initScrollChrome();
  initProjectFilter();
  initEmployeesSection();
  initContactForm();
  initModalEnhancements();
  initCustomCursor();
  initSmoothWheelScroll();
});

// ============================================================================
// 1. MOBILE NAVIGATION — BURGER MENU (<= 768px)
// ============================================================================
function initBurgerMenu() {
  const burgerBtn = document.getElementById('burger-btn') || document.querySelector('.mobile-nav-toggle');
  const mainNav = document.getElementById('main-navigation') || document.querySelector('.main-nav');
  const navBackdrop = document.querySelector('.nav-backdrop');

  if (!burgerBtn || !mainNav) return;

  function openMenu() {
    burgerBtn.classList.add('is-open');
    mainNav.classList.add('is-open');
    if (navBackdrop) navBackdrop.classList.add('is-open');
    document.body.classList.add('nav-open');
    burgerBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    burgerBtn.classList.remove('is-open');
    mainNav.classList.remove('is-open');
    if (navBackdrop) navBackdrop.classList.remove('is-open');
    document.body.classList.remove('nav-open');
    burgerBtn.setAttribute('aria-expanded', 'false');
  }

  function toggleMenu() {
    if (mainNav.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // Open / close navigation when clicking the Burger button
  burgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Auto-close mobile navigation when ANY menu link is clicked
  const menuLinks = mainNav.querySelectorAll('a');
  menuLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeMenu);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mainNav.classList.contains('is-open')) {
      closeMenu();
    }
  });
}

// ============================================================================
// 2. EMPLOYEES SECTION — READ-ONLY GET (No Add / No Edit / No Delete)
// ============================================================================
function initEmployeesSection() {
  const grid = document.getElementById('employees-grid');
  const loader = document.getElementById('employees-loading');
  const errorBox = document.getElementById('employees-error');
  const retryBtn = document.getElementById('employees-retry-btn');
  const emptyBox = document.getElementById('employees-empty');
  const countEl = document.getElementById('employees-count');

  if (!grid) return;

  function updateEmployeeCount() {
    const total = grid.querySelectorAll('.employee-card').length;
    if (countEl) {
      countEl.textContent = String(total);
    }
    if (emptyBox) {
      emptyBox.hidden = total > 0;
    }
  }

  function getInitials(fullName) {
    if (!fullName) return 'N';
    const cleaned = String(fullName)
      .replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.)\s+/i, '')
      .trim();
    const parts = cleaned.split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function normalizeWebsiteUrl(website) {
    if (!website) return '#';
    const trimmed = String(website).trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  }

  // Create strictly read-only architectural Employee Card
  function createEmployeeCard(user) {
    const id = user.id || '';
    const name = user.name || 'უცნობი თანამშრომელი';
    const email = user.email || '—';
    const phone = user.phone || '—';
    const website = user.website || '—';
    const companyName = (user.company && user.company.name)
      ? user.company.name
      : 'დამოუკიდებელი კონსულტანტი';

    const card = document.createElement('article');
    card.className = 'employee-card';

    const top = document.createElement('div');
    top.className = 'employee-card-top';

    const avatar = document.createElement('div');
    avatar.className = 'employee-avatar';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = getInitials(name);

    const heading = document.createElement('div');
    heading.className = 'employee-heading';

    const nameHeading = document.createElement('h3');
    nameHeading.className = 'employee-name';
    nameHeading.textContent = name;

    const companyBadge = document.createElement('span');
    companyBadge.className = 'employee-company-badge';
    companyBadge.textContent = companyName;

    heading.appendChild(nameHeading);
    heading.appendChild(companyBadge);

    const idTag = document.createElement('span');
    idTag.className = 'employee-id-tag';
    idTag.textContent = `#${String(id).padStart(2, '0')}`;

    top.appendChild(avatar);
    top.appendChild(heading);
    top.appendChild(idTag);

    const detailsList = document.createElement('ul');
    detailsList.className = 'employee-details';

    const rows = [
      {
        label: 'ელ-ფოსტა',
        value: email,
        href: email !== '—' ? `mailto:${email}` : null
      },
      {
        label: 'ტელეფონი',
        value: phone,
        href: phone !== '—' ? `tel:${phone}` : null
      },
      {
        label: 'ვებსაიტი',
        value: website,
        href: website !== '—' ? normalizeWebsiteUrl(website) : null,
        external: true
      },
      {
        label: 'კომპანია',
        value: companyName,
        href: null
      }
    ];

    rows.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'employee-detail-row';

      const labelSpan = document.createElement('span');
      labelSpan.className = 'employee-detail-label';
      labelSpan.textContent = item.label;

      let valueNode;
      if (item.href) {
        valueNode = document.createElement('a');
        valueNode.href = item.href;
        valueNode.className = 'employee-detail-value';
        if (item.external) {
          valueNode.target = '_blank';
          valueNode.rel = 'noopener noreferrer';
        }
      } else {
        valueNode = document.createElement('span');
        valueNode.className = 'employee-detail-value';
      }
      valueNode.textContent = item.value;
      valueNode.title = item.value;

      li.appendChild(labelSpan);
      li.appendChild(valueNode);
      detailsList.appendChild(li);
    });

    card.appendChild(top);
    card.appendChild(detailsList);

    return card;
  }

  async function fetchEmployees() {
    if (loader) loader.hidden = false;
    if (errorBox) errorBox.hidden = true;
    if (emptyBox) emptyBox.hidden = true;
    grid.innerHTML = '';

    try {
      const response = await fetch(EMPLOYEES_API_URL);
      if (!response.ok) {
        throw new Error(`HTTP შეცდომა: ${response.status}`);
      }

      const users = await response.json();
      const fragment = document.createDocumentFragment();

      users.forEach((user) => {
        fragment.appendChild(createEmployeeCard(user));
      });

      grid.appendChild(fragment);
      updateEmployeeCount();
    } catch (error) {
      console.error('Employees GET error:', error);
      if (errorBox) errorBox.hidden = false;
    } finally {
      if (loader) loader.hidden = true;
    }
  }

  if (retryBtn) {
    retryBtn.addEventListener('click', fetchEmployees);
  }

  fetchEmployees();
}

// ============================================================================
// 3. DYNAMIC 6-COLOR HSL ACCENT SWITCHER (datunashvili.com)
// ============================================================================
function initAccentSwitcher() {
  const buttons = document.querySelectorAll('.accent-dot-btn[data-accent-hsl]');

  function getSavedAccent() {
    try {
      const stored = localStorage.getItem(ACCENT_STORAGE_KEY);
      if (stored && ALLOWED_ACCENTS.has(stored)) {
        return stored;
      }
    } catch (_) {}
    return DEFAULT_ACCENT_HSL;
  }

  function applyAccent(hslValue, persist = true) {
    const targetHsl = ALLOWED_ACCENTS.has(hslValue) ? hslValue : DEFAULT_ACCENT_HSL;
    document.documentElement.style.setProperty('--primary', targetHsl);
    document.documentElement.style.setProperty('--ring', targetHsl);

    if (persist) {
      try {
        localStorage.setItem(ACCENT_STORAGE_KEY, targetHsl);
      } catch (_) {}
    }

    buttons.forEach((btn) => {
      const isSelected = btn.getAttribute('data-accent-hsl') === targetHsl;
      btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
      btn.textContent = isSelected ? '✓' : '';
    });
  }

  applyAccent(getSavedAccent(), false);

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const hsl = btn.getAttribute('data-accent-hsl');
      if (hsl) applyAccent(hsl, true);
    });
  });
}

// ============================================================================
// 4. SCROLL CHROME: HEADER BLUR, PROGRESS BAR & SECTION SCROLLSPY
// ============================================================================
function initScrollChrome() {
  const header = document.querySelector('.site-header');
  const progressBar = document.querySelector('.scroll-progress-bar');
  const mainNav = document.getElementById('main-navigation');

  // Detect single-page sections on index.html for active pill scrollspy
  const spyIds = ['experience', 'work', 'employees', 'skills', 'contact'];
  const spySections = spyIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function updateOnScroll() {
    const scrollY = window.scrollY || window.pageYOffset || 0;

    // 1. Header blurred backdrop state
    if (header) {
      if (scrollY > 24) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    // 2. Right-edge 2px vertical scroll progress bar
    if (progressBar) {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const ratio = Math.max(0.02, Math.min(1, scrollY / maxScroll));
      progressBar.style.transform = `scaleY(${ratio.toFixed(4)})`;
    }

    // 3. Active navigation pill scrollspy (only when flagship sections exist on page)
    if (mainNav && spySections.length > 0) {
      const triggerLine = scrollY + 190;
      let currentId = '';

      for (let i = 0; i < spySections.length; i += 1) {
        const sec = spySections[i];
        if (sec.offsetTop <= triggerLine) {
          currentId = sec.id;
        }
      }

      // If scrolled near the very bottom, activate the last section
      if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 40) {
        currentId = spySections[spySections.length - 1].id;
      }

      const navLinks = mainNav.querySelectorAll('.nav-link[href^="#"]');
      navLinks.forEach((link) => {
        const targetHash = link.getAttribute('href');
        if (currentId && targetHash === `#${currentId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  updateOnScroll();
  window.addEventListener('scroll', updateOnScroll, { passive: true });
  window.addEventListener('resize', updateOnScroll, { passive: true });
}

// ============================================================================
// 5. SHIPPED PROJECTS FILTER TABS
// ============================================================================
function initProjectFilter() {
  const filterButtons = document.querySelectorAll('.arch-filter-btn[data-filter]');
  const projectCards = document.querySelectorAll('.arch-project-card[data-group]');

  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filterValue = btn.getAttribute('data-filter') || 'all';

      filterButtons.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      projectCards.forEach((card) => {
        const groups = (card.getAttribute('data-group') || '').split(/\s+/);
        const matches = filterValue === 'all' || groups.includes(filterValue);
        card.hidden = !matches;
      });
    });
  });
}

// ============================================================================
// 6. ARCHITECTURAL CONTACT FORM HANDLER
// ============================================================================
function initContactForm() {
  const form = document.getElementById('arch-contact-form');
  const toast = document.getElementById('contact-toast');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    if (toast) {
      toast.textContent = '✓ შეტყობინება წარმატებით გაიგზავნა — მალე დაგიკავშირდებით.';
    }

    form.reset();

    setTimeout(() => {
      if (submitBtn) submitBtn.disabled = false;
    }, 600);
  });
}

// ============================================================================
// 7. MODAL ESCAPE KEY ENHANCEMENT
// ============================================================================
function initModalEnhancements() {
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (window.location.hash && window.location.hash.startsWith('#modal-')) {
      const activeModal = document.querySelector(`${window.location.hash}.modal-overlay`);
      if (activeModal) {
        const closeLink = activeModal.querySelector('.modal-close');
        if (closeLink && closeLink.getAttribute('href')) {
          window.location.hash = closeLink.getAttribute('href');
        } else {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      }
    }
  });
}

// ============================================================================
// 8. CUSTOM DYNAMIC ACCENT CURSOR (Fine-Pointer Devices)
// ============================================================================
function initCustomCursor() {
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!isFinePointer) return;

  let cursorDot = document.querySelector('.custom-cursor-dot');
  let cursorRing = document.querySelector('.custom-cursor-ring');

  if (!cursorDot) {
    cursorDot = document.createElement('div');
    cursorDot.className = 'custom-cursor-dot';
    cursorDot.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cursorDot);
  }

  if (!cursorRing) {
    cursorRing = document.createElement('div');
    cursorRing.className = 'custom-cursor-ring';
    cursorRing.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cursorRing);
  }

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let isCursorVisible = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;

    if (!isCursorVisible) {
      isCursorVisible = true;
      cursorDot.classList.add('visible');
      cursorRing.classList.add('visible');
      ringX = mouseX;
      ringY = mouseY;
    }
  });

  function animateRing() {
    if (isCursorVisible) {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
    }
    requestAnimationFrame(animateRing);
  }
  requestAnimationFrame(animateRing);

  const interactiveSelector =
    'a, button, [role="button"], label, input, textarea, select, summary, .arch-filter-btn, .arch-project-card, .employee-card, .accent-dot-btn, .filter-btn, .project-item, .timeline-card, .modal-close, .social-link';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelector)) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelector)) {
      document.body.classList.remove('cursor-hover');
    }
  });

  window.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  window.addEventListener('mouseup', () => document.body.classList.remove('cursor-click'));

  document.addEventListener('mouseleave', () => {
    cursorDot.classList.remove('visible');
    cursorRing.classList.remove('visible');
    isCursorVisible = false;
  });

  document.addEventListener('mouseenter', () => {
    if (mouseX > 0 && mouseY > 0) {
      cursorDot.classList.add('visible');
      cursorRing.classList.add('visible');
      isCursorVisible = true;
    }
  });
}

// ============================================================================
// 9. SMOOTH SLOW MOUSE WHEEL SCROLL
// ============================================================================
function initSmoothWheelScroll() {
  let targetY = window.pageYOffset || window.scrollY || 0;
  let currentY = targetY;
  let isScrollAnimating = false;

  window.addEventListener(
    'scroll',
    () => {
      if (!isScrollAnimating) {
        targetY = window.pageYOffset || window.scrollY || 0;
        currentY = targetY;
      }
    },
    { passive: true }
  );

  // Sync targetY when user clicks internal anchor links
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    isScrollAnimating = false;
    setTimeout(() => {
      targetY = window.pageYOffset || window.scrollY || 0;
      currentY = targetY;
    }, 60);
  });

  window.addEventListener(
    'wheel',
    (e) => {
      if (
        document.body.classList.contains('nav-open') ||
        e.target.closest('.modal-container') ||
        (window.innerWidth <= 768 && e.target.closest('.main-nav'))
      ) {
        return;
      }

      e.preventDefault();

      const deltaMultiplier = Math.abs(e.deltaY) >= 45 ? 0.42 : 0.72;
      targetY += e.deltaY * deltaMultiplier;

      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      targetY = Math.max(0, Math.min(targetY, maxScroll));

      if (!isScrollAnimating) {
        isScrollAnimating = true;
        requestAnimationFrame(renderSlowScroll);
      }
    },
    { passive: false }
  );

  function renderSlowScroll() {
    const ease = 0.085;
    currentY += (targetY - currentY) * ease;
    window.scrollTo(0, currentY);

    if (Math.abs(targetY - currentY) > 0.4) {
      requestAnimationFrame(renderSlowScroll);
    } else {
      currentY = targetY;
      window.scrollTo(0, currentY);
      isScrollAnimating = false;
    }
  }
}
