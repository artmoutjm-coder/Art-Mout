/* ============================================
   ART MOUT — main.js
============================================ */

// NAVBAR: add scrolled class
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// HAMBURGER + MOBILE MENU
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');
const mobileOverlay = document.getElementById('mobileOverlay');

function openMenu() {
  mobileMenu.classList.add('open');
  mobileOverlay.classList.add('open');
  hamburger.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  mobileMenu.classList.remove('open');
  mobileOverlay.classList.remove('open');
  hamburger.classList.remove('open');
  document.body.style.overflow = '';
}

if (hamburger) hamburger.addEventListener('click', openMenu);
if (mobileClose) mobileClose.addEventListener('click', closeMenu);
if (mobileOverlay) mobileOverlay.addEventListener('click', closeMenu);

// Close menu on mobile link click
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// SCROLL ANIMATIONS
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// Auto-add fade-up to key sections
const animateSelectors = [
  '.cuadro-card',
  '.product-card',
  '.mascota-item',
  '.intro',
  '.nosotros-text',
  '.contacto-inner',
  '.cta-final',
];

animateSelectors.forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add('fade-up');
    el.style.transitionDelay = `${i * 0.08}s`;
    observer.observe(el);
  });
});

// FILTER TABS (cotizar.html)
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

if (filterBtns.length > 0) {
  // Read URL param on load
  const params = new URLSearchParams(window.location.search);
  const tipoParam = params.get('tipo');
  if (tipoParam) {
    filterBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === tipoParam);
    });
    filterCards(tipoParam);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterCards(btn.dataset.filter);
    });
  });
}

function filterCards(filter) {
  productCards.forEach(card => {
    if (filter === 'all' || card.dataset.type === filter) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

// ============================================
// PROCESO: animación escalonada al entrar
// ============================================
const procesoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.proceso-step').forEach(el => procesoObserver.observe(el));

// ============================================
// TESTIMONIOS: animación al entrar
// ============================================
const testimonialsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.testimonio-card').forEach(el => testimonialsObserver.observe(el));

// ============================================
// FAQ: acordeón animado
// ============================================
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    const answer = btn.nextElementSibling;

    // Cerrar todos
    document.querySelectorAll('.faq-question').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling.classList.remove('open');
    });

    // Abrir el clickeado si estaba cerrado
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      answer.classList.add('open');
    }
  });
});

// ============================================
// NÚMERO ANIMADO: contador al entrar en vista
// (para futuros datos o estadísticas)
// ============================================
function animateCounter(el, target, duration = 1200) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.round(start);
  }, 16);
}

// ============================================
// LIGHTBOX
// ============================================
const lightbox        = document.getElementById('lightbox');
const lightboxOverlay = document.getElementById('lightboxOverlay');
const lightboxClose   = document.getElementById('lightboxClose');
const lightboxImg     = document.getElementById('lightboxImg');
const lightboxThumbs  = document.getElementById('lightboxThumbs');
const lightboxPrev    = document.getElementById('lightboxPrev');
const lightboxNext    = document.getElementById('lightboxNext');

if (lightbox) {
  let currentImages = [];
  let currentIndex  = 0;

  function openLightbox(images, index) {
    currentImages = images;
    currentIndex  = index;
    renderLightbox();
    lightbox.classList.add('open');
    lightboxOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightboxOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function renderLightbox() {
    // imagen principal con transición
    lightboxImg.classList.add('switching');
    setTimeout(() => {
      lightboxImg.src = currentImages[currentIndex];
      lightboxImg.classList.remove('switching');
    }, 150);

    // thumbnails
    lightboxThumbs.innerHTML = '';
    currentImages.forEach((src, i) => {
      const thumb = document.createElement('img');
      thumb.src = src;
      thumb.className = 'lightbox-thumb' + (i === currentIndex ? ' active' : '');
      thumb.addEventListener('click', () => {
        currentIndex = i;
        renderLightbox();
      });
      lightboxThumbs.appendChild(thumb);
    });
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    renderLightbox();
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % currentImages.length;
    renderLightbox();
  }

  // Click en imagen de tarjeta
  document.querySelectorAll('.product-img-wrap[data-gallery]').forEach(wrap => {
    wrap.addEventListener('click', () => {
      const images = JSON.parse(wrap.dataset.gallery);
      openLightbox(images, 0);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', prevImage);
  lightboxNext.addEventListener('click', nextImage);

  // Teclado: flechas y ESC
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   prevImage();
    if (e.key === 'ArrowRight')  nextImage();
  });

  // Swipe en móvil
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
  lightbox.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? nextImage() : prevImage();
  });
}

// ============================================
// PROTECCIÓN DE IMÁGENES
// ============================================
// Deshabilitar clic derecho sobre imágenes
document.addEventListener('contextmenu', (e) => {
  if (e.target.tagName === 'IMG') {
    e.preventDefault();
    return false;
  }
});

// Deshabilitar arrastrar imágenes
document.querySelectorAll('img').forEach(img => {
  img.setAttribute('draggable', 'false');
  img.addEventListener('dragstart', e => e.preventDefault());
});

// Deshabilitar atajo de teclado para guardar (Ctrl+S / Cmd+S)
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
  }
});
