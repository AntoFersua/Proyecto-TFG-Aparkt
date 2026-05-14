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
});


