/**
 * Main Interactive Script for Portfolio
 * Author: დავით ბერიძე — Lead UI/UX დიზაინერი & Frontend არქიტექტორი
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile & Tablet Hamburger Menu ("Hungerbar" <= 1024px)
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  let navBackdrop = document.querySelector('.nav-backdrop');

  if (navToggle && mainNav) {
    // Ensure backdrop exists for tablet/mobile drawer
    if (!navBackdrop) {
      navBackdrop = document.createElement('div');
      navBackdrop.className = 'nav-backdrop';
      navBackdrop.setAttribute('aria-hidden', 'true');
      document.body.appendChild(navBackdrop);
    }

    const closeMobileMenu = () => {
      mainNav.classList.remove('active');
      navBackdrop.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'მენიუს გახსნა');
      document.body.classList.remove('menu-open');
    };

    const openMobileMenu = () => {
      mainNav.classList.add('active');
      navBackdrop.classList.add('active');
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.setAttribute('aria-label', 'მენიუს დახურვა');
      document.body.classList.add('menu-open');
    };

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close when clicking backdrop
    navBackdrop.addEventListener('click', closeMobileMenu);

    // Close when clicking any link inside the drawer
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('active')) {
        closeMobileMenu();
        navToggle.focus();
      }
    });

    // Reset state cleanly if viewport is resized above tablet breakpoint (1024px)
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && mainNav.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  }

  // 2. Back to top button
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 3. Dynamic Footer Year
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 4. Modal Logic (for Projects details)
  const modalOverlay = document.getElementById('project-modal');
  const modalClose = document.querySelector('.modal-close');
  const modalBody = document.getElementById('modal-details-content');

  // Sample Project Data store for rich modal views
  const projectData = {
    'fintech': {
      title: 'Quantum Analytics — FinTech პლატფორმა',
      client: 'Apex Global Financials (ლონდონი / ნიუ-იორკი)',
      role: 'Lead UI/UX დიზაინერი & Frontend არქიტექტორი',
      year: '2025 - 2026',
      tech: ['React.js', 'TypeScript', 'D3.js Data Viz', 'Tailored CSS', 'WebSocket API'],
      summary: 'ინოვაციური ფინანსური ანალიტიკის პლატფორმა საინვესტიციო ფონდებისა და ტრეიდერებისთვის. სისტემა ამუშავებს მილიონობით ტრანზაქციას რეალურ დროში და წარადგენს მონაცემებს ულტრა-თანამედროვე, ინტუიციური გრაფიკებით.',
      achievements: [
        'მონაცემთა დამუშავების სიჩქარე გაიზარდა 40%-ით',
        'მომხმარებელთა კონვერსია გაუმჯობესდა 65%-ით',
        'დიზაინი აღიარებულია Best FinTech Dashboard 2025 ჯილდოთი'
      ]
    },
    'ecommerce': {
      title: 'Aura Atelier — ექსკლუზიური მოდის ელ-კომერცია',
      client: 'Aura Luxury Group (მილანი / პარიზი)',
      role: 'Creative Director & Lead Frontend Engineer',
      year: '2025',
      tech: ['Next.js', 'WebGL 3D Product View', 'Headless Shopify', 'Vanilla CSS Micro-interactions'],
      summary: 'მაღალი მოდისა და არქიტექტურული დიზაინის ობიექტების პრემიუმ ელექტრონული მაღაზია. მინიმალისტური ესთეტიკა, მდიდრული ზურმუხტისფერი აქცენტები და უმაღლესი დონის მობილური ადაპტაცია.',
      achievements: [
        'გვერდის ჩატვირთვის დრო 0.6 წამზე ნაკლები (Lighthouse 99)',
        'მობილური გაყიდვების ზრდა +82%',
        'Awwwards Site of the Day ნომინაცია'
      ]
    },
    'saas': {
      title: 'Synthesis AI — კრეატიული სისტემების ორკესტრაცია',
      client: 'Synthesis Corp (სან-ფრანცისკო)',
      role: 'Product Architect & Design Systems Lead',
      year: '2024 - 2025',
      tech: ['Vue 3', 'Canvas API', 'Design Tokens', 'Tailored Dark Theme', 'REST / GraphQL'],
      summary: 'ხელოვნური ინტელექტის საფუძველზე შექმნილი სამუშაო სივრცე დიზაინერებისა და ინჟინრებისთვის. კომპონენტების ავტომატური გენერაცია და დიზაინ-სისტემის უწყვეტი სინქრონიზაცია.',
      achievements: [
        '120,000+ ყოველთვიური აქტიური დეველოპერი',
        'სამუშაო პროცესის დაჩქარება 3.5-ჯერ',
        'Golden Kitty Award ფინალისტი ProductHunt-ზე'
      ]
    },
    'banking': {
      title: 'Horizon Mobile Banking — ციფრული ბანკინგი',
      client: 'Horizon Financial Group',
      role: 'Principal Mobile UX Designer',
      year: '2024',
      tech: ['React Native', 'Figma Design System', 'Biometrics API', 'Accessible UX'],
      summary: 'მომავლის თაობის მობილური ბანკინგი უსაფრთხოების უმაღლესი სტანდარტებით, ბიომეტრიული ავთენტიფიკაციით და პერსონალიზებული ფინანსური რჩევებით.',
      achievements: [
        'App Store რეიტინგი 4.9 ვარსკვლავი 45K+ შეფასებით',
        'ტრანზაქციების დროის შემცირება 50%-ით'
      ]
    },
    'healthcare': {
      title: 'BioPulse Health — ჯანდაცვის ტელემედიცინის პორტალი',
      client: 'BioPulse Medical Network',
      role: 'Senior UI/UX Researcher & Developer',
      year: '2024',
      tech: ['HTML5 / CSS3 Grid', 'WebRTC Video', 'Encrypted Data Storage', 'HIPAA Compliance'],
      summary: 'პაციენტებისა და ექიმების ვიდეო-კონსულტაციების, ანალიზების ისტორიისა და რეცეპტების ერთიანი, ინტუიციური ეკოსისტემა.',
      achievements: [
        'მიღწეულია 100% ხელმისაწვდომობის (WCAG AAA) სტანდარტი',
        '250,000+ წარმატებული დისტანციური კონსულტაცია'
      ]
    },
    'crypto': {
      title: 'Vortex Protocol — Web3 & DeFi პლატფორმა',
      client: 'Vortex Decentralized Labs',
      role: 'Web3 UX Specialist & Front-End Dev',
      year: '2023 - 2024',
      tech: ['Ethers.js', 'Custom CSS Glow System', 'WebSockets', 'SVG Animated Charts'],
      summary: 'დეცენტრალიზებული ფინანსური ოქმის ვებ-ინტერფეისი, რომელიც რთულ ბლოკჩეინ ტრანზაქციებს აქცევს მარტივ, ელეგანტურ და უსაფრთხო გამოცდილებად.',
      achievements: [
        '$1.2B+ ტრანზაქციების მოცულობა პლატფორმაზე',
        'Zero-error UX ტესტირების შედეგები'
      ]
    }
  };

  // Open modal handler
  window.openProjectModal = function(projectId) {
    const data = projectData[projectId];
    if (!data || !modalOverlay || !modalBody) return;

    modalBody.innerHTML = `
      <div style="margin-bottom: 24px; padding-right: 32px;">
        <span class="badge" style="margin-bottom: 12px;">${data.year}</span>
        <h2 style="font-size: clamp(1.35rem, 4vw, 1.85rem); margin-bottom: 8px;" class="text-gradient">${data.title}</h2>
        <p style="color: var(--emerald-light); font-weight: 600; font-size: 0.95rem;">კლიენტი: ${data.client}</p>
        <p style="color: var(--text-secondary); font-size: 0.88rem; margin-top: 4px;">როლი: ${data.role}</p>
      </div>

      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 1.15rem; margin-bottom: 8px; color: var(--text-primary);">პროექტის აღწერა</h3>
        <p style="color: var(--text-secondary); line-height: 1.7; font-size: 0.95rem;">${data.summary}</p>
      </div>

      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 1.15rem; margin-bottom: 12px; color: var(--text-primary);">გამოყენებული ტექნოლოგიები</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${data.tech.map(t => `<span style="background: rgba(16, 185, 129, 0.12); color: var(--emerald-light); padding: 5px 12px; border-radius: var(--radius-full); font-size: 0.82rem; border: 1px solid var(--emerald-border); font-weight: 500;">${t}</span>`).join('')}
        </div>
      </div>

      <div style="margin-bottom: 28px;">
        <h3 style="font-size: 1.15rem; margin-bottom: 10px; color: var(--text-primary);">ძირითადი მიღწევები და შედეგები</h3>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
          ${data.achievements.map(a => `<li style="display: flex; align-items: flex-start; gap: 10px; color: var(--text-secondary); font-size: 0.92rem;"><span style="color: var(--emerald-light); font-weight: bold; flex-shrink: 0;">✓</span> <span>${a}</span></li>`).join('')}
        </ul>
      </div>

      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <a href="contact.html" class="btn btn-primary" style="flex: 1 1 220px; text-align: center;">მსგავსი პროექტის დაწყება</a>
        <button onclick="closeProjectModal()" class="btn btn-outline" style="flex: 1 1 160px;">დახურვა</button>
      </div>
    `;

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeProjectModal = function() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (modalClose) {
    modalClose.addEventListener('click', window.closeProjectModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        window.closeProjectModal();
      }
    });
  }

  // Escape key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      window.closeProjectModal();
    }
  });

  // 5. Project Filter Tabs (Projects page)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-item');

  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue || category.includes(filterValue)) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // 6. Interactive Contact Form Submission
  const contactForm = document.getElementById('portfolio-contact-form');
  const formSuccessAlert = document.getElementById('form-success-alert');

  if (contactForm && formSuccessAlert) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      // Loading state simulation
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>იგზავნება...</span>';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();
        
        formSuccessAlert.style.display = 'block';
        formSuccessAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });

        setTimeout(() => {
          formSuccessAlert.style.display = 'none';
        }, 7000);
      }, 1000);
    });
  }
});
