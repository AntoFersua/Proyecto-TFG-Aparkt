document.addEventListener("DOMContentLoaded", () => {
  const navPrincipal = document.querySelector(".navPrincipal");
  const navUl = document.querySelector(".navPrincipal ul");
  if (!navPrincipal || !navUl) return;
  
  const navLinks = document.querySelectorAll(".navPrincipal ul li");

  let spanDelante = navUl.querySelector(".span-delante");
  if (!spanDelante) {
    spanDelante = document.createElement("span");
    spanDelante.className = "span-delante";
    navUl.appendChild(spanDelante);
  }

  let spanDetras = navUl.querySelector(".span-detras");
  if (!spanDetras) {
    spanDetras = document.createElement("span");
    spanDetras.className = "span-detras";
    navUl.appendChild(spanDetras);
  }

  let circle = navPrincipal.querySelector(".nav-circulo");
  if (!circle) {
    circle = document.createElement("div");
    circle.className = "nav-circulo";
    navPrincipal.appendChild(circle);
  }

  function moverCirculo(li) {
    const liRect = li.getBoundingClientRect();
    const navRect = navPrincipal.getBoundingClientRect();
    const ulRect = navUl.getBoundingClientRect();
    const circleLeft = liRect.left - navRect.left + liRect.width / 2 - 35;
    const spanLeft = liRect.left - ulRect.left + liRect.width / 2 - 35;
    circle.style.transform = `translateY(calc(-50% + 17px)) translateX(${circleLeft}px) scale(1)`;
    spanDelante.style.transform = `translateY(calc(-50% + 17px)) translateX(${spanLeft}px) scale(1)`;
    spanDetras.style.transform = `translateY(calc(-50% + 17px)) translateX(${spanLeft}px) scale(1)`;
  }

  function ocultarCirculo() {
    circle.style.transform = "translateY(-50%) scale(0)";
    spanDelante.style.transform = "translateY(-50%) scale(0)";
    spanDetras.style.transform = "translateY(-50%) scale(0)";
  }

  navLinks.forEach((li) => {
    li.addEventListener("mouseenter", () => {
      moverCirculo(li);
    });
  });

  navUl.addEventListener("mouseleave", () => {
    ocultarCirculo();
  });

  // ========================================================================
  // BANNER LATERAL DE USUARIO - Funcionalidad para todas las páginas
  // ========================================================================
  
  const botonPerfil = document.getElementById("perfilUsuario");
  const banner = document.getElementById("bannerUsuario");
  const botonCerrarBanner = document.getElementById("cerrarBanner");

  // Botón de cerrar banner
  if (botonCerrarBanner && banner) {
    botonCerrarBanner.addEventListener("click", function (e) {
      e.stopPropagation();
      banner.classList.remove("abierto");
      banner.style.transform = '';
    });
  }

  // Cerrar banner al hacer click fuera de él
  document.addEventListener("click", function (e) {
    if (banner && banner.classList.contains("abierto")) {
      if (!banner.contains(e.target) && !botonPerfil.contains(e.target)) {
        banner.classList.remove("abierto");
        banner.style.transform = '';
      }
    }
  });

  // ========================================================================
  // FORMULARIO AÑADIR VEHÍCULO - Movido a PerfilUsuario.js
  // ========================================================================

  /*const btnAnadirVehiculo = document.querySelector(".anadirVehiculo");
  const formVehiculo = document.getElementById("formVehiculo");

  if (btnAnadirVehiculo && formVehiculo) {
    formVehiculo.style.display = "none";
    btnAnadirVehiculo.addEventListener("click", function (e) {
      e.stopPropagation();
      if (formVehiculo.style.display === "none") {
        btnAnadirVehiculo.textContent = "Cancelar";
        formVehiculo.style.display = "flex";
      } else {
        btnAnadirVehiculo.textContent = "Añadir mi vehículo";
        formVehiculo.style.display = "none";
      }
    });
  }*/

  if (formVehiculo) {
    console.log("JustValidate:", typeof window.JustValidate);
    if (typeof window.JustValidate !== "undefined") {
      window.inicializarValidacionVehiculo();
    } else {
      console.log("JustValidate no cargado");
    }

    const selects = formVehiculo.querySelectorAll("select");
    selects.forEach(function (select) {
      select.addEventListener("change", function () {
        if (this.value) {
          this.classList.add("has-value");
        } else {
          this.classList.remove("has-value");
        }
      });

      select.addEventListener("focus", function () {
        this.classList.add("has-value");
      });

      select.addEventListener("blur", function () {
        if (!this.value) {
          this.classList.remove("has-value");
        }
      });
    });
  }

  // ========================================================================
  // VER PUNTUACIÓN
  // ========================================================================

  document.addEventListener("click", function (e) {
    if (e.target.closest(".verPuntuacion")) {
      if (document.querySelector("modal-puntos")) return;
      const modal = document.createElement("modal-puntos");
      document.body.appendChild(modal);
    }
    
    const overlay = e.target.closest(".modal-overlay");
    const botonCerrar = e.target.closest(".modal-button");
    if (overlay || botonCerrar) {
      const modal = document.querySelector("modal-puntos");
      if (modal) modal.remove();
    }
  });

  (function() {
        const tema = localStorage.getItem("modoOscuro");
        const esOscuro = tema === "true" || (tema === null && window.matchMedia("(prefers-color-scheme: dark)").matches);
        const valor = esOscuro ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", valor);
        document.documentElement.style.colorScheme = valor;
      })();

});
