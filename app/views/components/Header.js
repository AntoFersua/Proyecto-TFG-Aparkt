//Creación de componente Header que hereda de HTMLElement
class Header extends HTMLElement {
  constructor(nombre) {
    super();
  }

 
  //Método que se ejecuta directamente cuando el componente se añade al DOM
  connectedCallback() {
    this.render();
    this.initJS();
  }

  //Con este método pintamos el HTML del HEADER
  render() {
    this.innerHTML = `
        <header>
      <button class="menu-toggle" data-i18n-aria-label="headerMap.menuBtn" aria-label="Abrir menú" aria-expanded="false">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div class="logoHeader">
        <img src="../assets/imagotipoAparkt.webp" data-i18n-alt="header.logoAlt" alt="Logo" />
      </div>
      <div class="logoMobile">
        <img src="../assets/isotipoAparkt.webp" data-i18n-alt="header.logoAlt" alt="Isotipo" />
      </div>
      <nav class="navPrincipal" data-i18n-aria-label="header.navegacion" aria-label="Navegación principal">
        <ul>
          <li><a href="../index/index.html" data-i18n="nav.mapa">Mapa</a></li>
          <li class="nav-item-aparkt"><a href="../aparkt/aparkt.html" data-i18n="nav.aparkt">Aparkt</a></li>
          <li class="submenu-aparkt-mobile" aria-label="Secciones de Aparkt">
            <a href="../aparkt/aparkt.html#aparkt-inicio" data-i18n="nav.inicio">Inicio</a>
            <a href="../aparkt/aparkt.html#aparkt-problema" data-i18n="nav.problema">Problema</a>
            <a href="../aparkt/aparkt.html#aparkt-mapa" data-i18n="nav.mapa">Mapa</a>
            <a href="../aparkt/aparkt.html#aparkt-preguntas" data-i18n="nav.preguntas">Preguntas</a>
            <a href="../aparkt/aparkt.html#aparkt-recompensas" data-i18n="nav.recompensas">Recompensas</a>
            <a href="../aparkt/aparkt.html#aparkt-historia" data-i18n="nav.historia">Historia</a>
            <a href="../aparkt/aparkt.html#aparkt-equipo" data-i18n="nav.equipo">Equipo</a>
          </li>
          <li><a href="../login/login.html" data-i18n="nav.login">Log In</a></li>
          <li><a href="../signup/signup.html" data-i18n="nav.signup">Sign Up</a></li>
        </ul>
        <div class="submenu-aparkt" aria-label="Secciones de Aparkt">
          <a href="../aparkt/aparkt.html#aparkt-inicio" data-i18n="nav.inicio">Inicio</a>
          <a href="../aparkt/aparkt.html#aparkt-problema" data-i18n="nav.problema">Problema</a>
          <a href="../aparkt/aparkt.html#aparkt-mapa" data-i18n="nav.mapa">Mapa</a>
          <a href="../aparkt/aparkt.html#aparkt-preguntas" data-i18n="nav.preguntas">Preguntas</a>
          <a href="../aparkt/aparkt.html#aparkt-recompensas" data-i18n="nav.recompensas">Recompensas</a>
          <a href="../aparkt/aparkt.html#aparkt-historia" data-i18n="nav.historia">Historia</a>
          <a href="../aparkt/aparkt.html#aparkt-equipo" data-i18n="nav.equipo">Equipo</a>
        </div>
      </nav>
      <div id="headerDerecha">
        <button type="button" id="cambiarIdioma" data-i18n-aria-label="header.cambiarIdioma" aria-label="Cambiar idioma">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-translate" viewBox="0 0 16 16">
            <path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286zm1.634-.736L5.5 3.956h-.049l-.679 2.022z"/>
            <path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm7.138 9.995q.289.451.63.846c-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6 6 0 0 1-.415-.492 2 2 0 0 1-.94.31"/>
          </svg>
        </button>
        <button type="button" id="perfilUsuario" data-i18n-aria-label="header.perfilUsuario" aria-label="Perfil de usuario">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-person" viewBox="0 0 16 16">
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
          </svg>
        </button>
        <button type="button" id="modoOscuro" data-i18n-aria-label="header.modoOscuro" aria-label="Cambiar tema">
          <svg class="icon-sol" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg class="icon-luna" style="display:none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>
      </div>
    </header>`;
  }


  //Se inicializa la lógica del menú de navegación
  initJS() {
    const menuToggle = this.querySelector('.menu-toggle');
    const navPrincipal = this.querySelector('.navPrincipal');
    const submenuAparkt = this.querySelector(".submenu-aparkt");
    const navItemAparkt = this.querySelector(".nav-item-aparkt");
    
    if (menuToggle && navPrincipal) {
      menuToggle.addEventListener('click', () => {
        const isOpen = navPrincipal.classList.toggle('active');
        menuToggle.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isOpen);
      });
    }

    const navUl = this.querySelector(".navPrincipal ul");
    if (navPrincipal && navUl) {
      const navLinks = this.querySelectorAll(".navPrincipal ul li");
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

      //Mueve el círculo de animación sobre el menú
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

      //Oculta los efectos que tiene el menu cuando el ratón sale del menú
      function ocultarCirculo() {
        circle.style.transform = "translateY(-50%) scale(0)";
        spanDelante.style.transform = "translateY(-50%) scale(0)";
        spanDetras.style.transform = "translateY(-50%) scale(0)";
      }

      //Hover sobre cada opción del menú 
      navLinks.forEach((li) => li.addEventListener("mouseenter", () => moverCirculo(li)));
      //Cuando el cursor sale del menú
      navUl.addEventListener("mouseleave", ocultarCirculo);
    }

    if (navPrincipal && navItemAparkt && submenuAparkt) {
      function posicionarSubmenuAparkt() {
        if (window.matchMedia("(max-width: 768px)").matches) {
          submenuAparkt.style.removeProperty("--submenu-left");
          return;
        }

        const itemRect = navItemAparkt.getBoundingClientRect();
        const navRect = navPrincipal.getBoundingClientRect();
        const left = itemRect.left - navRect.left + itemRect.width / 2;
        submenuAparkt.style.setProperty("--submenu-left", `${left}px`);
      }

      posicionarSubmenuAparkt();
      window.addEventListener("resize", posicionarSubmenuAparkt);
      navItemAparkt.addEventListener("mouseenter", posicionarSubmenuAparkt);

      this.querySelectorAll(".submenu-aparkt a, .submenu-aparkt-mobile a").forEach((link) => {
        link.addEventListener("click", () => {
          navPrincipal.classList.remove("active");
          menuToggle?.classList.remove("active");
          menuToggle?.setAttribute("aria-expanded", "false");
        });
      });
    }

    const btnIdioma = this.querySelector('#cambiarIdioma');
    if (btnIdioma) {
      btnIdioma.addEventListener('click', async () => {
        await import('./ModalIdioma.js');
        document.querySelector('modal-idioma')?.remove();
        const modal = document.createElement('modal-idioma');
        document.body.appendChild(modal);
      });
    }
  }
}

//Registramos el componente personalizado para poder usarlo luego como <app-header></app-header>
customElements.define("app-header", Header);
