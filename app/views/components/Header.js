class Header extends HTMLElement {
  constructor(nombre) {
    super();
  }

  connectedCallback() {
    this.render();
    this.initJS();
  }

  render() {
    this.innerHTML = `
        <header>
      <div class="logoHeader">
        <img src="../assets/imagotipoAparkt.png" alt="Logo" />
      </div>
      <nav class="navPrincipal">
        <ul>
          <li><a href="../index.html">Mapa</a></li>
          <li><a href="../aparkt/aparkt.html">Aparkt</a></li>
          <li><a href="../login/login.html">Log In</a></li>
          <li><a href="../signup/signup.html">Sign Up</a></li>
        </ul>
      </nav>
      <div id="headerDerecha">
        <button type="button">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-translate" viewBox="0 0 16 16">
            <path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286zm1.634-.736L5.5 3.956h-.049l-.679 2.022z"/>
            <path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm7.138 9.995q.289.451.63.846c-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6 6 0 0 1-.415-.492 2 2 0 0 1-.94.31"/>
          </svg>
        </button>
        <button type="button" id="perfilUsuario">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-person" viewBox="0 0 16 16">
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
          </svg>
        </button>
        <button type="button" id="modoOscuro" aria-label="Cambiar tema">
          <svg class="icon-sol" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
          <svg class="icon-luna" style="display:none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>
      </div>
    </header>`;
  }

  initJS() {
    const navUl = this.querySelector(".navPrincipal ul");
    if (navUl) {
      const navLinks = this.querySelectorAll(".navPrincipal ul li");
      let spanDelante = document.createElement("span");
      spanDelante.className = "span-delante";
      navUl.appendChild(spanDelante);
      let spanDetras = document.createElement("span");
      spanDetras.className = "span-detras";
      navUl.appendChild(spanDetras);
      let circle = document.createElement("div");
      circle.className = "nav-circulo";
      navUl.appendChild(circle);

      function moverCirculo(li) {
        const liRect = li.getBoundingClientRect();
        const ulRect = navUl.getBoundingClientRect();
        const left = liRect.left - ulRect.left + liRect.width / 2 - 35;
        circle.style.transform = `translateY(calc(-50% + 17px)) translateX(${left}px) scale(1)`;
        spanDelante.style.transform = `translateY(calc(-50% + 17px)) translateX(${left}px) scale(1)`;
        spanDetras.style.transform = `translateY(calc(-50% + 17px)) translateX(${left}px) scale(1)`;
      }
      function ocultarCirculo() {
        circle.style.transform = "translateY(-50%) scale(0)";
        spanDelante.style.transform = "translateY(-50%) scale(0)";
        spanDetras.style.transform = "translateY(-50%) scale(0)";
      }
      navLinks.forEach((li) => li.addEventListener("mouseenter", () => moverCirculo(li)));
      navUl.addEventListener("mouseleave", ocultarCirculo);
    }
  }
}

customElements.define("app-header", Header);
