import { cargarTraducciones, getIdiomaActual, cambiarIdioma } from '../translator.js';

//Componente llamado ModalIdioma que hereda de HTMLElement
class ModalIdioma extends HTMLElement {
  //Constructor para crear el componente
  constructor() {
    super();
    this.idiomas = ['es', 'en', 'fr', 'de'];
  }

  //Método que se ejecuta una vez ya han cargado las traducciones
  async connectedCallback() {
    await cargarTraducciones();
    this.render();
    this.agregarEventListeners();
  }


  //Con este método pintamos el HTML
  render() {
    const idiomaActual = getIdiomaActual();

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
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
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
  gap: 12px;
}

.opcion-idioma {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid #e0e0e0;
  background: white;
  cursor: pointer;
  transition: 0.2s;

  text-align: left;
}

.opcion-idioma:hover {
  background: #f7fff9;
  border-color: #b5ffc2;
}

.opcion-idioma.seleccionado {
  border-color: #34af72;
  background: #f7fff9;
}

.info-idioma {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}


.bandera svg {
  width: 28px;
  height: 18px;
  display: block;
  border-radius: 3px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.15);
}


.texto-idioma {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.nombre-idioma {
  font-weight: bold;
  color: #005a60;
  font-size: 18px;
  padding: 5px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.region {
  font-size: 13px;
  color: #888;
  padding: 5px;
  white-space: nowrap;
}


.radio-idioma {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #ccc;
  background: transparent;

  flex-shrink: 0;
}

.opcion-idioma.seleccionado .radio-idioma {
  border-color: #34af72;
}

.opcion-idioma.seleccionado .radio-idioma::after {
  content: "";
  width: 8px;
  height: 8px;
  background: #34af72;
  border-radius: 50%;
  display: block;
  margin: 3px auto;
}

.pie-modal {
  padding: 0 24px 24px;
}

.btn-guardar {
  width: 100%;
  background: #005a60;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-guardar:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}
 
/* RESPONSIVE (VISTA MÓVIL) */
@media (max-width: 600px) {

  .overlay-modal {
    padding: 10px;
    align-items: center;
  }

  .caja-modal {
  width: 92%;
  max-width: 360px;
  max-height: 75vh;
  overflow-y: auto;
  border-radius: 18px 18px 18px 18px;
  animation: slideUp 0.25s ease;
  margin: 0 auto; 
}

  @keyframes slideUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .cabecera-modal {
    padding: 14px;
  }

  .cabecera-modal h2 {
    font-size: 20px;
  }

  .cabecera-modal p {
    font-size: 14px;
  }

  .contenido-modal {
    padding: 12px;
    gap: 8px;
  }

  .opcion-idioma {
    padding: 10px 12px;
    border-radius: 12px;
  }

  .nombre-idioma {
    font-size: 15px;
  }

  .region {
    font-size: 11px;
  }

  .bandera svg {
    width: 22px;
    height: 14px;
  }

  .radio-idioma {
    width: 16px;
    height: 16px;
  }

  .btn-guardar {
    padding: 12px;
    font-size: 14px;
    border-radius: 12px;
  }

  .btn-guardar:hover {
    transform: none;
    box-shadow: none;
  }

  .opcion-idioma {
    transition: none;
  }

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
      ${this.idiomas.map(codigo => `
        <button class="opcion-idioma${codigo === idiomaActual ? ' seleccionado' : ''}" data-idioma="${codigo}">
          <div class="info-idioma">
            <span class="bandera" data-flag="${codigo}"></span>
            <div>
              <p class="nombre-idioma">${this.getNombreIdioma(codigo)}</p>
              <p class="region">${this.getRegion(codigo)}</p>
            </div>
          </div>
          <div class="radio-idioma"></div>
        </button>
      `).join('')}
    </div>

    <div class="pie-modal">
      <button id="saveLanguage" class="btn-guardar">Guardar idioma</button>
    </div>
  </div>
</div>`;

    this.querySelectorAll('.bandera').forEach(el => {
      const codigo = el.dataset.flag;
      el.innerHTML = this.getBandera(codigo);
    });
  }

  getBandera(codigo) {
    const banderas = {
      es: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2">
          <rect width="3" height="2" fill="#AA151B"/>
          <rect y="0.5" width="3" height="1" fill="#F1BF00"/>
        </svg>
      `,

      de: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2">
          <rect width="3" height="2" fill="#000000"/>
          <rect y="0.666" width="3" height="0.666" fill="#DD0000"/>
          <rect y="1.333" width="3" height="0.667" fill="#FFCE00"/>
        </svg>
      `,

      fr: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2">
          <rect width="1" height="2" fill="#0055A4"/>
          <rect x="1" width="1" height="2" fill="#FFFFFF"/>
          <rect x="2" width="1" height="2" fill="#EF4135"/>
        </svg>
      `,

      en: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30">
          <rect width="60" height="30" fill="#012169"/>
          <path d="M0 0 L60 30" stroke="#FFFFFF" stroke-width="6"/>
          <path d="M60 0 L0 30" stroke="#FFFFFF" stroke-width="6"/>
          <path d="M0 0 L60 30" stroke="#C8102E" stroke-width="3"/>
          <path d="M60 0 L0 30" stroke="#C8102E" stroke-width="3"/>
          <rect x="24" width="12" height="30" fill="#FFFFFF"/>
          <rect y="12" width="60" height="6" fill="#FFFFFF"/>
          <rect x="27" width="6" height="30" fill="#C8102E"/>
          <rect y="13.5" width="60" height="3" fill="#C8102E"/>
        </svg>
      `
    };

    return banderas[codigo] || '';
  }

  getNombreIdioma(codigo) {
    return { es: 'Español', en: 'English', fr: 'Français', de: 'Deutsch' }[codigo] || codigo;
  }

  getRegion(codigo) {
    return { es: 'España', en: 'United Kingdom', fr: 'France', de: 'Germany' }[codigo] || '';
  }

  agregarEventListeners() {
    const botonCerrar = this.querySelector('#closeLanguageModal');
    const botonGuardar = this.querySelector('#saveLanguage');
    const overlay = this.querySelector('.overlay-modal');
    const opciones = this.querySelectorAll('.opcion-idioma');

    botonCerrar?.addEventListener('click', () => this.remove());

    overlay?.addEventListener('click', (e) => {
      if (e.target === overlay) this.remove();
    });

    opciones.forEach(btn => {
      btn.addEventListener('click', () => {
        opciones.forEach(o => o.classList.remove('seleccionado'));
        btn.classList.add('seleccionado');
      });
    });

    botonGuardar?.addEventListener('click', async () => {
      const seleccionado = this.querySelector('.opcion-idioma.seleccionado');
      if (seleccionado) {
        await cambiarIdioma(seleccionado.dataset.idioma);
      }
      this.remove();
    });
  }
}

if (!customElements.get("modal-idioma")) {
  customElements.define("modal-idioma", ModalIdioma);
}
