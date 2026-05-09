(() => {
  const carrusel = $(".owl-carousel");

  carrusel.owlCarousel({
    items: 1,
    loop: true,
    margin: 0,
    nav: true,
    dots: true,

    // Mejora UX
    smartSpeed: 600,
    autoplay: true,
    autoplayTimeout: 8000,
    autoplayHoverPause: true,

    // Interacción
    mouseDrag: true,
    touchDrag: true,

    // Flechas personalizadas
    navText: [
      "<span class='arrow left'>‹</span>",
      "<span class='arrow right'>›</span>",
    ],

    // Responsive por si luego quieres más slides
    responsive: {
      768: {
        items: 1,
      },
      1024: {
        items: 1,
      },
    },
  });
})();

// Animaciones con GSAP
gsap.registerPlugin(ScrollTrigger);
const horizontalSection = document.querySelector(".horizontal");
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

// Coche que avanza con el scroll horizontal
const car = document.querySelector(".car");
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


