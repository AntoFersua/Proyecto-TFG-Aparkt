class PerfilUsuario extends HTMLElement {
  constructor() {
    super();
  }

  // Método que se llama cuando el elemento se conecta al DOM.
  connectedCallback() {
    this.render();
  }

  //Aquí pintamos el HTML del modal PerfilUsuario
  render() {
    this.innerHTML = `
           <aside id="bannerUsuario" class="banner-lateral">
        <button class="cerrar-banner" id="cerrarBanner">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            width="18"
            height="18"
          >
            <path
              fill="white"
              d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"
            />
          </svg>
        </button>
        <div class="banner-header">
          <h2>Mi Perfil</h2>
        </div>
        <div class="banner-body">
          <div class="menu-superior">
            <div class="menu-opciones">
              <button class="opcion-btn">Cambiar contraseña</button>
              <button class="opcion-btn">Editar foto de perfil</button>
              <button class="opcion-btn">Cambiar email</button>
              <button class="opcion-btn">Editar vehículo</button>
              <button class="opcion-btn">Borrar vehículo</button>
              <button class="opcion-btn anadirVehiculo">
                Añadir mi vehículo
              </button>
              <button class="opcion-btn verPuntuacion">
              Ver puntuación
              </button>
            </div>
            <form id="formVehiculo" class="form-vehiculo" style="display: none">
              <div class="form-group">
                <label for="tipoVehiculo">Tipo de vehículo</label>
                <select id="tipoVehiculo" name="tipo_vehiculo">
                  <option value=""></option>
                  <option value="turismo">Turismo</option>
                  <option value="ranchera">Ranchera</option>
                  <option value="todoterreno">Todoterreno</option>
                  <option value="monovolumen">Monovolumen</option>
                  <option value="furgo">Furgoneta</option>
                  <option value="otro">Otro</option>
                </select>
                <div id="error-tipoVehiculo"></div>
              </div>
              <div class="form-group">
                <label for="tamanoVehiculo">Tamaño</label>
                <select id="tamanoVehiculo" name="tamano">
                  <option value=""></option>
                  <option value="pequeno">Pequeño</option>
                  <option value="mediano">Mediano</option>
                  <option value="grande">Grande</option>
                </select>
                <div id="error-tamanoVehiculo"></div>
              </div>
              <button type="submit" class="btn-guardar">Guardar</button>
            </form>
          </div>
          <div class="menu-inferior">
            <button class="opcion-btn" id="logout">Cerrar sesión</button>
            <button class="opcion-btn danger">Eliminar cuenta</button>
          </div>
        </div>
      </aside>`;
  }
}

// Registrar el componente personalizado
customElements.define("perfil-usuario", PerfilUsuario);
