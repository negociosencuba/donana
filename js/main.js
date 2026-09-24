/* =========================================================
   VERDEL · main.js
   ========================================================= */

(() => {
  'use strict';

  /* ---------- Año en footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header scroll ---------- */
  const header = document.getElementById('header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 10);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Menú móvil ---------- */
  const toggle    = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('mobile-menu');

  if (toggle && mobileNav) {

    // Estado inicial forzado: cerrado
    mobileNav.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');

    const setOpen = (open) => {
      mobileNav.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('menu-open', open);
    };

    // Botón hamburguesa
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      setOpen(mobileNav.hidden);
    });

    // Cerrar al pulsar un enlace
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => setOpen(false));
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileNav.hidden) {
        setOpen(false);
        toggle.focus();
      }
    });

    // Cerrar al pasar a desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 900 && !mobileNav.hidden) setOpen(false);
    });
  }

  /* ---------- Filtros de menú ---------- */
  const filterBtns = document.querySelectorAll('.filter');
  const cards = document.querySelectorAll('.menu-card');
  if (filterBtns.length && cards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.toggle('is-active', b === btn);
          b.setAttribute('aria-selected', String(b === btn));
        });
        const f = btn.dataset.filter;
        cards.forEach(card => {
          const show = f === 'all' || card.dataset.cat === f;
          card.classList.toggle('is-hidden', !show);
        });
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Formulario → WhatsApp ---------- */
  const form = document.getElementById('reserva-form');
  if (form) {
    const WHATSAPP = '5358557125'; // Ej: 34600111222 (sin +, sin espacios)

    const setError = (name, msg) => {
      const input = form.querySelector(`[name="${name}"]`);
      const slot = form.querySelector(`[data-error-for="${name}"]`);
      if (input) input.classList.toggle('is-error', !!msg);
      if (slot) slot.textContent = msg || '';
    };

    const validate = (data) => {
      let ok = true;
      ['nombre', 'personas', 'fecha', 'hora', 'telefono'].forEach(k => setError(k, ''));

      if (!data.nombre || data.nombre.trim().length < 2) {
        setError('nombre', 'Introduce tu nombre'); ok = false;
      }
      if (!data.personas) { setError('personas', 'Indica cuántos sois'); ok = false; }
      if (!data.fecha)    { setError('fecha', 'Elige una fecha'); ok = false; }
      if (!data.hora)     { setError('hora', 'Elige una hora'); ok = false; }

      const tel = (data.telefono || '').replace(/[\s\-()]/g, '');
      if (!/^\+?\d{7,15}$/.test(tel)) {
        setError('telefono', 'Teléfono no válido'); ok = false;
      }
      return ok;
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      if (!validate(data)) {
        const firstError = form.querySelector('.is-error');
        if (firstError) firstError.focus();
        return;
      }

      const lines = [
        '¡Hola VERDEL! 👋 Quiero reservar mesa:',
        '',
        `• Nombre: ${data.nombre}`,
        `• Personas: ${data.personas}`,
        `• Fecha: ${data.fecha}`,
        `• Hora: ${data.hora}`,
        `• Mi WhatsApp: ${data.telefono}`,
      ];
      if (data.notas && data.notas.trim()) {
        lines.push('', `• Notas: ${data.notas.trim()}`);
      }
      lines.push('', 'Gracias 🌿');

      const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`;
      window.open(url, '_blank', 'noopener');
    });
  }
})();
/* ---------- Fecha automática en páginas legales ---------- */
const legalDate = document.getElementById('legal-date');
if (legalDate) {
  const hoy = new Date();
  const hace10 = new Date(hoy);
  hace10.setDate(hoy.getDate() - 10);

  // Formato largo en español: "13 de septiembre de 2026"
  const formatoLargo = new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  legalDate.textContent = formatoLargo.format(hace10);

  // Formato ISO para el atributo datetime (SEO y accesibilidad)
  const yyyy = hace10.getFullYear();
  const mm   = String(hace10.getMonth() + 1).padStart(2, '0');
  const dd   = String(hace10.getDate()).padStart(2, '0');
  legalDate.setAttribute('datetime', `${yyyy}-${mm}-${dd}`);
}