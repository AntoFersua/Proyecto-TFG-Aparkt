function obtenerRutaBase() {
  const ruta = window.location.pathname;
  if (ruta.includes("/Proyecto-TFG-Aparkt/")) return "/Proyecto-TFG-Aparkt";
  if (ruta.includes("/app/")) return "";
  return "";
}

class Modalpuntos extends HTMLElement {
  constructor() {
    super();
    this.puntuacion = 0;
    this.puntosCrear = 10;
    this.puntosOcupar = 5;
    this.puntosLiberar = 15;
    this.cargando = true;
  }

  connectedCallback() {
    this.fetchPuntuacion();
  }

  async fetchPuntuacion() {
    try {
      const rutaBase = obtenerRutaBase();
      const response = await fetch(rutaBase + "/app/controllers/MeController.php", {
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
  }

  render() {
    const puntos = this.cargando ? "..." : Number(this.puntuacion).toLocaleString("es-ES");

    this.innerHTML = `<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    z-index: 1000;
  }

  .modal {
    width: 100%;
    max-width: 420px;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(16px);
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }

  .modal-content {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .modal-header {
    text-align: center;
  }

  .modal-title {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 12px;
  }

  .points-circle {
    width: 160px;
    height: 160px;
    margin: 0 auto;
    border-radius: 50%;
    background: rgba(46, 204, 113, 0.15);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .points-value {
    font-size: 36px;
    font-weight: bold;
    color: #2ecc71;
  }

  .points-label {
    font-size: 12px;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-top: 6px;
    color: #555;
  }

  .rewards-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .reward-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 12px;
  }

  .reward-text {
    font-size: 15px;
  }

  .reward-points {
    font-weight: 600;
    color: #2ecc71;
  }

  .modal-button {
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: 999px;
    background: #2ecc71;
    color: white;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: transform 0.1s ease, box-shadow 0.1s ease;
  }

  .modal-button:active {
    transform: scale(0.97);
  }
</style>

<div class="modal-overlay">
  <div class="modal">
    <div class="modal-content">

      <div class="modal-header">
        <div class="modal-title">Mis Recompensas</div>

        <div class="points-circle">
          <div class="points-value">${puntos}</div>
          <div class="points-label">Puntos</div>
        </div>
      </div>

      <div class="rewards-list">
        <div class="reward-item">
          <span class="reward-text">Crear plazas</span>
          <span class="reward-points">+${this.puntosCrear} pts</span>
        </div>

        <div class="reward-item">
          <span class="reward-text">Ocupar plazas</span>
          <span class="reward-points">+${this.puntosOcupar} pts</span>
        </div>

        <div class="reward-item">
          <span class="reward-text">Liberar plazas</span>
          <span class="reward-points">+${this.puntosLiberar} pts</span>
        </div>
      </div>

      <button class="modal-button">Cerrar</button>

    </div>
  </div>
</div>
`;
  }
}

customElements.define("modal-puntos", Modalpuntos);
