//Creación de componente personalizado que se llama ModalAparcamiento
class ModalAparcamiento extends HTMLElement {
  constructor() {
    super();
  }

  //Método que se ejecuta cuando el componente se añade al DOM
  connectedCallback() {
    this.render();
    this.agregarEventListeners();
  }

  //Método con el que se pinta el contenido que tiene el modal
  render() {
    this.innerHTML = `
<style>
* {
  box-sizing: border-box;
  margin:0;
  padding:0;
  font-family: Arial, sans-serif;
}

/* Fondo desenfocado */
.fondo-blur {
  position: fixed;
  inset: 0;
  z-index: 0;
}

.fondo-blur img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(8px) scale(1.05);
}

.capa-blanca {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.2);
}

/* Overlay modal */
.overlay-modal {
  position: fixed;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0,0,0,0.1);
  backdrop-filter: blur(6px);
}

/* Caja modal */
.caja-modal {
  width: 100%;
  max-width: 420px;
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(18px);
  border-radius: 28px;
  border: 1px solid rgba(255,255,255,0.3);
  box-shadow: 0 25px 50px rgba(0,0,0,0.15);
  overflow: hidden;
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icono-header {
  background: rgba(46,204,113,0.2);
  padding: 8px;
  border-radius: 10px;
  font-size: 20px;
}

.titulo-modal {
  font-size: 18px;
  font-weight: bold;
}

.boton-cerrar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background: #eee;
}

/* Contenido */
.modal-cuerpo {
  padding: 0 20px 20px 20px;
}

.descripcion {
  font-size: 14px;
  color: #555;
  margin-bottom: 20px;
}

/* Botones */
.boton-accion {
  width: 100%;
  border: none;
  border-radius: 16px;
  padding: 14px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

/* Variantes */
.accion-primaria {
  background: linear-gradient(#2ecc71, #27ae60);
  color: white;
}

.accion-secundaria {
  border: 1px solid #2ecc71;
  background: white;
  color: #2ecc71;
}

/* Footer */
.modal-footer {
  padding: 20px;
  text-align: center;
}

.boton-cerrar-footer {
  background: none;
  border: none;
  color: #2ecc71;
  font-weight: bold;
  cursor: pointer;
}
</style>


<!-- Modal -->
<div class="overlay-modal">
  <div class="caja-modal">
    <div class="modal-header">
      <div class="header-left">
        <div class="icono-header">🅿️</div>
        <div class="titulo-modal">Gestionar Plaza</div>
      </div>
      <button class="boton-cerrar">✕</button>
    </div>

    <div class="modal-cuerpo">
      <p class="descripcion">
        Has seleccionado la plaza <strong>P-242</strong>. ¿Qué acción deseas realizar?
      </p>

      <button class="boton-accion accion-primaria">
        <span>Liberar Plaza</span>
        <span>›</span>
      </button>

      <button class="boton-accion accion-secundaria">
        <span>Ocupar Plaza</span>
        <span>›</span>
      </button>
    </div>

    <div class="modal-footer">
      <button class="boton-cerrar-footer">Cerrar</button>
    </div>
  </div>
</div>
`;
  }

  agregarEventListeners() {
    const botonCerrar = this.querySelector('.boton-cerrar');
    const botonCerrarFooter = this.querySelector('.boton-cerrar-footer');
    const overlay = this.querySelector('.overlay-modal');

    if (botonCerrar) {
      botonCerrar.addEventListener('click', () => this.remove());
    }
    if (botonCerrarFooter) {
      botonCerrarFooter.addEventListener('click', () => this.remove());
    }
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.remove();
      });
    }
  }
}

// Define el nuevo elemento personalizado "app-footer" y lo asocia con la clase footer.
customElements.define("modal-aparcamiento", ModalAparcamiento);