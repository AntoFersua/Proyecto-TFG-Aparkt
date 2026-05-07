class ModalIdioma extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.agregarEventListeners();
  }

  render() {
    this.innerHTML = `<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

.overlay-modal {
  position: fixed;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(6px);
}

.caja-modal {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: fadeIn 0.25s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.cabecera-modal {
  background: linear-gradient(135deg, #005a60, #34af72);
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cabecera-modal h2 {
  color: white;
  font-size: 22px;
  font-weight: bold;
}

.cabecera-modal p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  margin-top: 4px;
}

.btn-cerrar {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.btn-cerrar:hover {
  background: rgba(255, 255, 255, 0.1);
}

.btn-cerrar svg {
  width: 24px;
  height: 24px;
}

.contenido-modal {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.opcion-idioma {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-radius: 16px;
  border: 1px solid #e0e0e0;
  background: white;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}

.opcion-idioma:hover {
  background: #f0fdf4;
  border-color: #b5ffc2;
}

.opcion-idioma.seleccionado {
  background: #f0fdf4;
  border-color: #34af72;
}

.info-idioma {
  display: flex;
  align-items: center;
  gap: 16px;
}

.info-idioma .bandera {
  font-size: 28px;
}

.info-idioma .nombre-idioma {
  font-weight: bold;
  color: #005a60;
  font-size: 15px;
}

.info-idioma .region {
  font-size: 13px;
  color: #888;
}

.radio-idioma {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #ccc;
  flex-shrink: 0;
  transition: all 0.2s;
}

.opcion-idioma.seleccionado .radio-idioma {
  border-color: #34af72;
  background: #34af72;
}

.pie-modal {
  padding: 0 24px 24px;
}

.btn-guardar {
  width: 100%;
  background: #34af72;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 4px 12px rgba(52, 175, 114, 0.3);
}

.btn-guardar:hover {
  background: #2d9a63;
}
</style>

<div class="overlay-modal">
  <div class="caja-modal">
    <div class="cabecera-modal">
      <div>
        <h2>Seleccionar idioma</h2>
        <p>Elige el idioma de la plataforma</p>
      </div>
      <button id="closeLanguageModal" class="btn-cerrar">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div class="contenido-modal">
      <button class="opcion-idioma seleccionado" data-idioma="es">
        <div class="info-idioma">
          <span class="bandera">🇪🇸</span>
          <div>
            <p class="nombre-idioma">Español</p>
            <p class="region">España</p>
          </div>
        </div>
        <div class="radio-idioma"></div>
      </button>

      <button class="opcion-idioma" data-idioma="en">
        <div class="info-idioma">
          <span class="bandera">🇬🇧</span>
          <div>
            <p class="nombre-idioma">English</p>
            <p class="region">United Kingdom</p>
          </div>
        </div>
        <div class="radio-idioma"></div>
      </button>

      <button class="opcion-idioma" data-idioma="fr">
        <div class="info-idioma">
          <span class="bandera">🇫🇷</span>
          <div>
            <p class="nombre-idioma">Français</p>
            <p class="region">France</p>
          </div>
        </div>
        <div class="radio-idioma"></div>
      </button>

      <button class="opcion-idioma" data-idioma="de">
        <div class="info-idioma">
          <span class="bandera">🇩🇪</span>
          <div>
            <p class="nombre-idioma">Deutsch</p>
            <p class="region">Germany</p>
          </div>
        </div>
        <div class="radio-idioma"></div>
      </button>
    </div>

    <div class="pie-modal">
      <button id="saveLanguage" class="btn-guardar">Guardar idioma</button>
    </div>
  </div>
</div>`;
  }

  agregarEventListeners() {
    const botonCerrar = this.querySelector('#closeLanguageModal');
    const botonGuardar = this.querySelector('#saveLanguage');
    const overlay = this.querySelector('.overlay-modal');
    const opciones = this.querySelectorAll('.opcion-idioma');

    if (botonCerrar) {
      botonCerrar.addEventListener('click', () => this.remove());
    }
    if (botonGuardar) {
      botonGuardar.addEventListener('click', () => this.remove());
    }
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.remove();
      });
    }

    opciones.forEach((btn) => {
      btn.addEventListener('click', () => {
        opciones.forEach((o) => o.classList.remove('seleccionado'));
        btn.classList.add('seleccionado');
      });
    });
  }
}

customElements.define("modal-idioma", ModalIdioma);
