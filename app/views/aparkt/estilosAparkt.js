document.addEventListener("DOMContentLoaded", () => {
  // Carrusel
  const carrusel = $(".owl-carousel");

  carrusel.owlCarousel({
    items: 1,
    loop: true,
    margin: 0,
    nav: true,
    dots: true,
    smartSpeed: 600,
    autoplay: true,
    autoplayTimeout: 8000,
    autoplayHoverPause: true,
    mouseDrag: true,
    touchDrag: true,
    navText: [
      "<span class='arrow left'>‹</span>",
      "<span class='arrow right'>›</span>",
    ],
    responsive: {
      768: { items: 1 },
      1024: { items: 1 },
    },
  });

  // GSAP Scroll Horizontal - solo desktop con matchMedia
  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  mm.add("(min-width: 769px)", () => {
    const horizontalSection = document.querySelector(".horizontal");
    if (horizontalSection) {
      gsap.to(horizontalSection, {
        x: () =>
          -(horizontalSection.scrollWidth - document.documentElement.clientWidth) +
          "px",
        ease: "none",
        scrollTrigger: {
          trigger: horizontalSection,
          start: "top top",
          end: () => "+=" + (horizontalSection.scrollWidth - innerWidth),
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      });

      const car = document.querySelector(".car");
      if (car) {
        gsap.to(car, {
          x: () => horizontalSection.scrollWidth - 200,
          ease: "none",
          scrollTrigger: {
            trigger: horizontalSection,
            start: "top top",
            end: () => "+=" + (horizontalSection.scrollWidth - innerWidth),
            scrub: 0.5,
          },
        });
      }
    }
  });

   const tarjetas = document.querySelectorAll('.tarjeta');
  const puntosEl = document.querySelectorAll('.punto');
  let indiceActual = 0;

  function activar(indice) {
    indiceActual = indice;
    tarjetas.forEach(t => t.classList.remove('activa'));
    puntosEl.forEach(p => p.classList.remove('activo'));
    tarjetas[indice].classList.add('activa');
    if (puntosEl[indice]) puntosEl[indice].classList.add('activo');
  }

  tarjetas.forEach((tarjeta, i) => {
    tarjeta.addEventListener('mouseenter', () => activar(i));
  });
  document.querySelector('.tarjetas').addEventListener('mouseleave', () => activar(0));

  tarjetas.forEach((tarjeta, i) => {
    tarjeta.addEventListener('click', () => activar(i));
  });

  puntosEl.forEach((punto, i) => {
    punto.addEventListener('click', () => activar(i));
  });

  let startX = 0;
  const contenedor = document.querySelector('.tarjetas');

  contenedor.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  contenedor.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) activar(Math.min(indiceActual + 1, tarjetas.length - 1));
      else activar(Math.max(indiceActual - 1, 0));
    }
  }, { passive: true });


  //Ocultar y ajustar elementos del mapa del iframe de aparkt
  document.querySelector('iframe').addEventListener('load', function() {
    //acceder al documento interno del iframe
    const doc = this.contentDocument || this.contentWindow.document;
    //ocultar encabezado del mapa
    doc.querySelector('header-map').style.display = 'none';
    //ocultar perfil del usuario
    doc.querySelector('perfil-usuario').style.display = 'none';
    //eliminar si existe el script del modo oscuro
    const modoOscuro = doc.querySelector('script[src*="modoOscuro"]');
    if (modoOscuro) modoOscuro.remove();
    //posicionar la lupa y el menú de interactividad
    doc.getElementById('btn-lupa').style.bottom = '20px';
    doc.getElementById('menu-interactividad').style.bottom = '90px';
  });
});


