/* =================================================================
   JORGE COTA PROPIEDADES — interacciones
   Vanilla JS · sin dependencias
   ================================================================= */
(function () {
  'use strict';

  /* ---------- Año dinámico en footer ----------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header: sombra al hacer scroll --------------------- */
  var header = document.querySelector('.site-header');
  var onScroll = function () {
    if (window.scrollY > 20) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menú mobile ---------------------------------------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');

  function closeNav() {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      if (nav.classList.contains('open')) closeNav();
      else {
        nav.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'Cerrar menú');
      }
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });
  }

  /* ---------- Reveal on scroll ----------------------------------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Carrusel de propiedades ---------------------------- */
  var track = document.getElementById('propTrack');
  var prevBtn = document.getElementById('carPrev');
  var nextBtn = document.getElementById('carNext');
  var dotsWrap = document.getElementById('carDots');

  if (track) {
    var cards = Array.prototype.slice.call(track.children);

    // Cantidad de tarjetas visibles según ancho
    function perView() {
      var w = window.innerWidth;
      if (w >= 980) return 3;
      if (w >= 680) return 2;
      return 1;
    }

    // Crear dots (una por "página")
    function buildDots() {
      dotsWrap.innerHTML = '';
      var pages = Math.max(1, cards.length - perView() + 1);
      for (var i = 0; i < pages; i++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Ir a propiedad ' + (i + 1));
        b.addEventListener('click', (function (idx) {
          return function () { scrollToCard(idx); };
        })(i));
        dotsWrap.appendChild(b);
      }
    }

    function cardStep() {
      if (cards.length < 2) return cards[0].offsetWidth;
      return cards[1].offsetLeft - cards[0].offsetLeft;
    }

    function scrollToCard(idx) {
      track.scrollTo({ left: idx * cardStep(), behavior: 'smooth' });
    }

    function currentIndex() {
      return Math.round(track.scrollLeft / cardStep());
    }

    function updateUI() {
      var idx = currentIndex();
      var dots = dotsWrap.querySelectorAll('button');
      dots.forEach(function (d, i) { d.classList.toggle('active', i === idx); });
      var maxScroll = track.scrollWidth - track.clientWidth - 2;
      prevBtn.disabled = track.scrollLeft <= 2;
      nextBtn.disabled = track.scrollLeft >= maxScroll;
    }

    prevBtn.addEventListener('click', function () { track.scrollBy({ left: -cardStep(), behavior: 'smooth' }); });
    nextBtn.addEventListener('click', function () { track.scrollBy({ left: cardStep(), behavior: 'smooth' }); });

    var raf;
    track.addEventListener('scroll', function () {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateUI);
    }, { passive: true });

    var resizeT;
    window.addEventListener('resize', function () {
      clearTimeout(resizeT);
      resizeT = setTimeout(function () { buildDots(); updateUI(); }, 200);
    });

    buildDots();
    updateUI();
  }

  /* ---------- Parallax sutil en hero ----------------------------- */
  var heroImg = document.querySelector('.hero-photo img');
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (heroImg && !prefersReduced) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < window.innerHeight) {
          heroImg.style.transform = 'scale(1.06) translateY(' + (y * 0.10) + 'px)';
        }
        ticking = false;
      });
    }, { passive: true });
  }

  /* ============================================================== */
  /* DATOS DE PROPIEDADES (editá / agregá acá)                      */
  /* Cada clave coincide con el data-prop de la card en el HTML.    */
  /* gallery: la 1ª imagen es la principal. tagClass: color etiqueta*/
  /* ============================================================== */
  function img(id) { return 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=1100&q=75'; }

  var PROPERTIES = {
    'casa-moderna': {
      operation: 'Venta', tagClass: 'tag-venta', ref: 'JCP-1042',
      title: 'Casa moderna', address: 'Villa Tesei, Hurlingham',
      price: 'US$ 250.000',
      specs: [
        { v: '4', l: 'Ambientes' }, { v: '3', l: 'Dormitorios' }, { v: '2', l: 'Baños' },
        { v: '200 m²', l: 'Cubiertos' }, { v: '300 m²', l: 'Terreno' }, { v: '1', l: 'Cochera' }
      ],
      description: 'Excelente casa de diseño contemporáneo en una de las zonas más buscadas de Hurlingham. Distribuida en dos plantas, combina amplios espacios con mucha luz natural, terminaciones de primera calidad y un fondo con pileta ideal para disfrutar todo el año. A pasos de colegios, comercios y principales accesos.',
      features: ['Pileta', 'Parrilla cubierta', 'Suite principal', 'Cocina integrada', 'Losa radiante', 'Cochera cubierta', 'Jardín con riego', 'Apta crédito'],
      gallery: [img('1568605114967-8130f3a36994'), img('1586023492125-27b2c045efd7'), img('1600585152220-90363fe7e115'), img('1505693416388-ac5ce068fe85')]
    },
    'depto-premium': {
      operation: 'Venta', tagClass: 'tag-venta', ref: 'JCP-1057',
      title: 'Departamento premium', address: 'Hurlingham Centro',
      price: 'US$ 135.000',
      specs: [
        { v: '2', l: 'Ambientes' }, { v: '1', l: 'Dormitorio' }, { v: '1', l: 'Baño' },
        { v: '65 m²', l: 'Cubiertos' }, { v: '8 m²', l: 'Balcón' }, { v: '4°', l: 'Piso' }
      ],
      description: 'Departamento a estrenar en edificio con amenities, a metros de la estación. Categoría premium, muy luminoso, con balcón aterrazado y excelente vista abierta. Ideal como vivienda o inversión con renta inmediata.',
      features: ['A estrenar', 'Balcón aterrazado', 'Amenities', 'SUM', 'Seguridad 24 hs', 'Laundry', 'Cochera opcional', 'Bajas expensas'],
      gallery: [img('1502672260266-1c1ef2d93688'), img('1554995207-c18c203602cb'), img('1560448204-e02f11c3d0e2'), img('1505691938895-1758d7feb511')]
    },
    'casa-alquiler': {
      operation: 'Alquiler', tagClass: 'tag-alquiler', ref: 'JCP-1063',
      title: 'Casa en alquiler', address: 'William Morris, Hurlingham',
      price: '$ 780.000', priceNote: '/ mes',
      specs: [
        { v: '3', l: 'Ambientes' }, { v: '2', l: 'Dormitorios' }, { v: '2', l: 'Baños' },
        { v: '160 m²', l: 'Cubiertos' }, { v: '1', l: 'Cochera' }, { v: 'Sí', l: 'Patio' }
      ],
      description: 'Casa en planta baja con patio y parrilla, en barrio residencial tranquilo. Living comedor amplio, cocina independiente y dos dormitorios con placard. Contrato a 36 meses, apta familia. Se solicita garantía propietaria.',
      features: ['Patio con parrilla', 'Apto mascotas', 'Cocina independiente', 'Placares', 'Lavadero', 'Cochera', 'Muy luminosa', 'Contrato 36 meses'],
      gallery: [img('1512917774080-9991f1c4c750'), img('1583608205776-bfd35f0d9f83'), img('1416331108676-a22ccb276e35'), img('1522708323590-d24dbb6b0267')]
    },
    'galpon-industrial': {
      operation: 'Venta', tagClass: 'tag-galpon', ref: 'JCP-1071',
      title: 'Galpón industrial', address: 'Parque Industrial, Hurlingham',
      price: 'US$ 350.000',
      specs: [
        { v: '600 m²', l: 'Cubiertos' }, { v: '800 m²', l: 'Terreno' }, { v: '8 m', l: 'Altura' },
        { v: '2', l: 'Oficinas' }, { v: 'Sí', l: 'Trifásica' }, { v: 'Sí', l: 'Entrada camión' }
      ],
      description: 'Galpón de estructura sólida apto para múltiples rubros, con excelente acceso para camiones y cercanía a los accesos principales. Cuenta con oficinas, sanitarios, entrepiso y portón de altura. Ideal para logística, producción o depósito.',
      features: ['Entrada para camiones', 'Energía trifásica', 'Oficinas', 'Sanitarios', 'Entrepiso', 'Portón automático', 'Matafuegos', 'Excelente acceso'],
      gallery: [img('1565610222536-ef125c59da2e'), img('1581094794329-c8112a89af12'), img('1586528116311-ad8dd3c8310d'), img('1497366216548-37526070297c')]
    },
    'lote-venta': {
      operation: 'Venta', tagClass: 'tag-lote', ref: 'JCP-1080',
      title: 'Lote en venta', address: 'Hurlingham',
      price: 'US$ 95.000',
      specs: [
        { v: '500 m²', l: 'Superficie' }, { v: '10 m', l: 'Frente' }, { v: '50 m', l: 'Fondo' },
        { v: 'Sí', l: 'Servicios' }, { v: 'Sí', l: 'Esquina' }, { v: 'Apto', l: 'Dúplex' }
      ],
      description: 'Excelente lote en esquina con todos los servicios disponibles, apto para vivienda unifamiliar, dúplex o emprendimiento multivivienda. Zona en pleno desarrollo, a metros de avenida y transporte. Documentación al día, escritura inmediata.',
      features: ['Todos los servicios', 'Apto dúplex', 'Esquina', 'Zona en desarrollo', 'Documentación al día', 'Escritura inmediata', 'Apto crédito', 'Mensura vigente'],
      gallery: [img('1500382017468-9049fed747ef'), img('1542621334-a254cf47733d'), img('1416879595882-3373a0480b5b'), img('1574323347407-f5e1ad6d020b')]
    }
  };

  /* ---------- Modal de detalle ----------------------------------- */
  var modal = document.getElementById('propModal');
  if (modal) {
    var MAPS_URL = 'https://www.google.com/maps/place/Jorge+Cota+Propiedades/@-34.5886364,-58.6290834,17z';
    var el = {
      mainImg: document.getElementById('pmMainImg'),
      thumbs: document.getElementById('pmThumbs'),
      tag: document.getElementById('pmTag'),
      ref: document.getElementById('pmRef'),
      title: document.getElementById('pmTitle'),
      locText: document.getElementById('pmLocText'),
      price: document.getElementById('pmPrice'),
      specs: document.getElementById('pmSpecs'),
      desc: document.getElementById('pmDesc'),
      features: document.getElementById('pmFeatures'),
      wa: document.getElementById('pmWa'),
      map: document.getElementById('pmMap'),
      prev: document.getElementById('pmPrev'),
      next: document.getElementById('pmNext'),
      dots: document.getElementById('pmDots'),
      mainWrap: modal.querySelector('.pmg-main'),
      closeBtn: modal.querySelector('.pmodal-close')
    };
    var lastFocus = null;
    var gallery = [], idx = 0;

    /* Mostrar imagen N de la galería (carrusel) */
    function showIndex(i) {
      if (!gallery.length) return;
      idx = Math.max(0, Math.min(i, gallery.length - 1));
      el.mainImg.src = gallery[idx];

      var btns = el.thumbs.querySelectorAll('button');
      btns.forEach(function (b, j) { b.classList.toggle('active', j === idx); });
      if (btns[idx]) btns[idx].scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });

      el.dots.querySelectorAll('span').forEach(function (d, j) { d.classList.toggle('active', j === idx); });

      el.prev.hidden = (idx === 0);
      el.next.hidden = (idx === gallery.length - 1);
    }

    function openModal(key) {
      var p = PROPERTIES[key];
      if (!p) return;

      el.tag.className = 'tag ' + p.tagClass;
      el.tag.textContent = p.operation;
      el.ref.textContent = 'Referencia ' + p.ref;
      el.title.textContent = p.title;
      el.locText.textContent = p.address;
      el.price.innerHTML = p.price + (p.priceNote ? ' <small>' + p.priceNote + '</small>' : '');
      el.specs.innerHTML = p.specs.map(function (s) {
        return '<li><span class="ps-val">' + s.v + '</span><span class="ps-lbl">' + s.l + '</span></li>';
      }).join('');
      el.desc.textContent = p.description;
      el.features.innerHTML = p.features.map(function (f) { return '<li>' + f + '</li>'; }).join('');
      el.wa.href = 'https://wa.me/5491130036228?text=' +
        encodeURIComponent('Hola, quiero consultar por ' + p.title + ' (Ref. ' + p.ref + ') de Jorge Cota Propiedades.');
      el.map.href = MAPS_URL;

      // Galería (carrusel)
      gallery = p.gallery.slice();
      el.mainImg.alt = p.title;
      el.thumbs.innerHTML = gallery.map(function (src) {
        return '<button type="button"><img src="' + src + '" alt="" loading="lazy"></button>';
      }).join('');
      el.thumbs.querySelectorAll('button').forEach(function (b, j) {
        b.addEventListener('click', function () { showIndex(j); });
      });
      el.dots.innerHTML = gallery.map(function () { return '<span></span>'; }).join('');
      showIndex(0);

      // Mostrar
      el.mainImg.scrollIntoView ? null : null;
      modal.querySelector('.pmodal-grid').scrollTop = 0;
      var sc = modal.querySelector('.pmodal-info-scroll'); if (sc) sc.scrollTop = 0;
      document.body.classList.add('pmodal-lock');
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      lastFocus = document.activeElement;
      el.closeBtn.focus();
    }

    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('pmodal-lock');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    modal.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', closeModal); });

    // Flechas del carrusel
    el.prev.addEventListener('click', function () { showIndex(idx - 1); });
    el.next.addEventListener('click', function () { showIndex(idx + 1); });

    // Teclado: Escape cierra, flechas navegan la galería
    document.addEventListener('keydown', function (e) {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape') closeModal();
      else if (e.key === 'ArrowLeft') showIndex(idx - 1);
      else if (e.key === 'ArrowRight') showIndex(idx + 1);
    });

    // Swipe táctil (tipo Instagram)
    var startX = null, startY = null;
    el.mainWrap.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX; startY = e.touches[0].clientY;
    }, { passive: true });
    el.mainWrap.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      var dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        showIndex(idx + (dx < 0 ? 1 : -1));
      }
      startX = null; startY = null;
    }, { passive: true });

    // Disparar desde las cards (sin pisar el botón Consultar de WhatsApp)
    document.querySelectorAll('.property-card[data-prop]').forEach(function (card) {
      var key = card.getAttribute('data-prop');
      card.addEventListener('click', function (e) {
        if (e.target.closest('a.btn')) return;
        openModal(key);
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(key); }
      });
    });
  }

})();
