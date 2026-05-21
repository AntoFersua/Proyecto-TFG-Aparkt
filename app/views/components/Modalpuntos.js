import { t, getIdiomaActual } from '../translator.js';

//Componente llamado ModalPuntos que hereda de HTMLElement
class Modalpuntos extends HTMLElement {
  //Constructor para crear el componente
  constructor() {
    super();
    this.puntuacion = 0;
    this.puntosCrear = 10;
    this.puntosOcupar = 5;
    this.puntosLiberar = 15;
    this.cargando = true;
  }

  //Método que se ejecuta cuando el componente se añade al DOM
  connectedCallback() {
    this.fetchPuntuacion();
  }

  //Asincronía para traer desde el backend la puntuación de usuario
  async fetchPuntuacion() {
    try {
      const response = await fetch("../../controllers/MeController.php", {
        credentials: "include"
      });
      const data = await response.json();

      if (data.logueado) {
        this.puntuacion = data.puntuacion ?? 0;
        this.puntosCrear = data.puntosCrear ?? 100;
        this.puntosOcupar = data.puntosOcupar ?? 50;
        this.puntosLiberar = data.puntosLiberar ?? 150;
      }
    } catch (error) {
      console.error("Error al obtener puntuación:", error);
    }

    this.cargando = false;
    this.render();
    this.agregarEventListeners();
  }

  //Con este método pintamos el HTML
  render() {
    const localeMap = { es: "es-ES", en: "en-US", fr: "fr-FR", de: "de-DE" };
    const locale = localeMap[getIdiomaActual()] || "es-ES";
    const puntos = this.cargando ? "..." : Number(this.puntuacion).toLocaleString(locale);

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
  z-index: 100005;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(6px);
}

.caja-modal {
  width: 100%;
  max-width: 420px;
  background: var(--bg-primary);
  border-radius: 24px;
  box-shadow: var(--shadow-card);
  overflow: hidden;
  animation: fadeIn 0.25s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.cabecera-modal {
  background: linear-gradient(135deg, var(--color-azulOscuro), var(--color-verde));
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
  color: rgba(255,255,255,0.7);
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
  background: rgba(255,255,255,0.1);
}

.btn-cerrar svg {
  width: 24px;
  height: 24px;
}

/* CONTENIDO */
.contenido-modal {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* CÍRCULO */
.points-circle {
  width: 150px;
  height: 150px;
  margin: 10px auto 20px auto;
  border-radius: 50%;
  background: rgba(52,175,114,0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.points-value {
  font-size: 34px;
  font-weight: bold;
  color: var(--color-azulOscuro);
}

.points-label {
  font-size: 12px;
  letter-spacing: 2px;
  color: var(--text-secondary);
}

.reward-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid var(--color-verde);
  background: var(--bg-primary);
  cursor: pointer;
  transition: 0.2s;
}

.reward-item:hover {
  background: var(--bg-secondary);
  border-color: var(--color-verdeAmarillo);
}

.reward-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.reward-text {
  font-weight: bold;
  color: var(--color-azulOscuro);
  font-size: 16px;
}

.reward-sub {
  font-size: 13px;
  color: var(--text-muted);
}

.reward-points {
  font-weight: 600;
  color: var(--color-azulOscuro);
  flex-shrink: 0;
}

/* PIE */
.pie-modal {
  padding: 0 24px 24px;
}

.modal-button {
  width: 100%;
  background: var(--color-azulOscuro);
  color: var(--text-on-dark);
  border: none;
  padding: 14px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.modal-button:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}

/*RESPONSIVE (VISTA MÓVIL)*/
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

  .cabecera-modal h2 {
    font-size: 24px;
  }

  .cabecera-modal p {
    font-size: 22px;
  }

  .reward-text{
  font-size: 15px;
  }
  }

</style>

<div class="overlay-modal">
  <div class="caja-modal">
    <div class="cabecera-modal">
      <div>
        <h2>${t('modalPuntos.titulo')}</h2>
        <p>${t('modalPuntos.puntos')}</p>
      </div>

      <button class="btn-cerrar" id="closePointsModal">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <div class="contenido-modal">

      <div class="points-circle">
        <div class="points-value">${puntos}</div>
        <div class="points-label">${t('modalPuntos.label')}</div>
      </div>

      <div class="reward-item">
        <div class="reward-info">
          <div class="reward-text">${t('modalPuntos.crearPlazas')}</div>
        </div>
        <div class="reward-points">+${this.puntosCrear} ${t('modalPuntos.pts')}</div>
      </div>

      <div class="reward-item">
        <div class="reward-info">
          <div class="reward-text">${t('modalPuntos.ocuparPlazas')}</div>
        </div>
        <div class="reward-points">+${this.puntosOcupar} ${t('modalPuntos.pts')}</div>
      </div>

      <div class="reward-item">
        <div class="reward-info">
          <div class="reward-text">${t('modalPuntos.liberarPlazas')}</div>
        </div>
        <div class="reward-points">+${this.puntosLiberar} ${t('modalPuntos.pts')}</div>
      </div>

    </div>

    <div class="pie-modal">
      <button class="modal-button">${t('modalPuntos.cerrar')}</button>
    </div>

  </div>
</div>`;
  }

  //Eventos
  agregarEventListeners() {
    const closeBtn = this.querySelector("#closePointsModal");
    const btn = this.querySelector(".modal-button");
    const overlay = this.querySelector(".overlay-modal");

    closeBtn?.addEventListener("click", () => this.remove());
    btn?.addEventListener("click", () => this.remove());

    overlay?.addEventListener("click", (e) => {
      if (e.target === overlay) this.remove();
    });
  }
}

if (!customElements.get("modal-puntos")) {
  customElements.define("modal-puntos", Modalpuntos);
}
