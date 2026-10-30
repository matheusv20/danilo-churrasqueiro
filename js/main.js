/**
 * Danilo Churrasqueiro - Interatividade & Experiência Mobile-First
 */

document.addEventListener('DOMContentLoaded', () => {
  initGalleryLightbox();
  initGalleryFilter();
  initQuoteForm();
  initVideoBehavior();
});

/* ==========================================================================
   Gallery Lightbox with Mobile Swipe & Keyboard Navigation
   ========================================================================== */
function initGalleryLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const imgElement = document.getElementById('lightbox-img');
  const titleElement = document.getElementById('lightbox-title');
  const descElement = document.getElementById('lightbox-desc');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (!modal) return;

  const cards = Array.from(document.querySelectorAll('.gallery-card'));
  let currentIndex = 0;

  function showImage(index) {
    if (index < 0) index = cards.length - 1;
    if (index >= cards.length) index = 0;
    currentIndex = index;

    const card = cards[currentIndex];
    const img = card.querySelector('.gallery-img');
    const title = card.querySelector('.gallery-title')?.innerText || '';
    const desc = card.querySelector('.gallery-caption')?.innerText || '';

    imgElement.src = img.src;
    imgElement.alt = img.alt;
    titleElement.innerText = title;
    descElement.innerText = desc;
  }

  function openLightbox(index) {
    showImage(index);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  cards.forEach((card, idx) => {
    const wrap = card.querySelector('.gallery-img-wrap');
    if (wrap) {
      wrap.addEventListener('click', () => openLightbox(idx));
    }
  });

  closeBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', () => showImage(currentIndex - 1));
  nextBtn?.addEventListener('click', () => showImage(currentIndex + 1));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });

  // Touch Swipe for Mobile
  let touchStartX = 0;
  let touchEndX = 0;

  modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  modal.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      showImage(currentIndex + 1); // Swipe left -> Next
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      showImage(currentIndex - 1); // Swipe right -> Prev
    }
  }
}

/* ==========================================================================
   Gallery Category Filter
   ========================================================================== */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.gallery-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   Quote Simulator / WhatsApp Link Generator
   ========================================================================== */
function initQuoteForm() {
  const form = document.getElementById('quote-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('client-name')?.value.trim() || 'Cliente';
    const eventType = document.getElementById('event-type')?.value || 'Evento';
    const guestCount = document.getElementById('guest-count')?.value || 'Não informado';
    const eventDate = document.getElementById('event-date')?.value || 'A definir';
    const city = document.getElementById('event-city')?.value.trim() || 'Não informada';
    const serviceType = document.getElementById('service-type')?.value || 'Churrasco Completo';
    const notes = document.getElementById('event-notes')?.value.trim() || '';

    let message = `Olá Danilo! Acessei seu site através do QR Code do seu cartão de visita e gostaria de um orçamento:%0A%0A`;
    message += `👤 *Nome:* ${encodeURIComponent(name)}%0A`;
    message += `🎉 *Tipo de Evento:* ${encodeURIComponent(eventType)}%0A`;
    message += `👥 *Estimativa de Convidados:* ${encodeURIComponent(guestCount)}%0A`;
    message += `📅 *Data Prevista:* ${encodeURIComponent(eventDate)}%0A`;
    message += `📍 *Cidade / Local:* ${encodeURIComponent(city)}%0A`;
    message += `🥩 *Preferência:* ${encodeURIComponent(serviceType)}%0A`;

    if (notes) {
      message += `📝 *Observações:* ${encodeURIComponent(notes)}%0A`;
    }

    message += `%0APoderia me passar maiores informações e disponibilidade? Obrigado!`;

    const zapUrl = `https://wa.me/5516981104351?text=${message}`;
    window.open(zapUrl, '_blank');
  });
}

/* ==========================================================================
   Videos Mutual Pause (Stop overlap)
   ========================================================================== */
function initVideoBehavior() {
  const videos = document.querySelectorAll('.video-player');
  videos.forEach(video => {
    video.addEventListener('play', () => {
      videos.forEach(otherVideo => {
        if (otherVideo !== video && !otherVideo.paused) {
          otherVideo.pause();
        }
      });
    });
  });
}
