import { obtenerRutaBase } from '../auth.js';

class PerfilUsuario extends HTMLElement {
  constructor() {
    super();
  }

  // Método que se llama cuando el elemento se conecta al DOM.
  connectedCallback() {
    this.render();
    this.configurarEventos();
  }

  configurarEventos() {
    const btnEliminar = this.querySelector('#eliminarCuenta');
    btnEliminar.addEventListener('click', () => this.eliminarCuenta());

    const btnBorrarVehiculo = this.querySelector('#borrarVehiculo');
    btnBorrarVehiculo.addEventListener('click', () => this.borrarVehiculo());

    const btnCambiarEmail = this.querySelector('.cambiarEmail');
    btnCambiarEmail.addEventListener('click', (e) => this.cambiarEmail(e));

    const formEmail = this.querySelector('#formEmail');
    formEmail.addEventListener('submit', (e) => this.enviarCambioEmail.call(this, e));

    const btnCerrar = this.querySelector('#cerrarBanner');
    btnCerrar.addEventListener('click', () => this.cerrarBanner());

    // Label flotante para selects del formulario de vehículo
    this.configurarLabelFlotante();

    // Mostrar/ocultar formulario vehículo
    const btnAnadirVehiculo = this.querySelector('.anadirVehiculo');
    const formVehiculo = this.querySelector('#formVehiculo');
    let vehiculoVisible = false;
    
    if (btnAnadirVehiculo && formVehiculo) {
      btnAnadirVehiculo.addEventListener('click', (e) => {
        e.stopPropagation();
        vehiculoVisible = !vehiculoVisible;
        if (vehiculoVisible) {
          btnAnadirVehiculo.textContent = 'Cancelar';
          formVehiculo.style.display = 'flex';
        } else {
          btnAnadirVehiculo.textContent = 'Añadir mi vehículo';
          formVehiculo.style.display = 'none';
        }
      });
    }

    // Label flotante para input de email
    const inputEmail = this.querySelector('#nuevoEmail');
    if (inputEmail) {
      inputEmail.addEventListener('focus', () => {
        inputEmail.classList.add('has-value');
      });
      inputEmail.addEventListener('blur', () => {
        if (!inputEmail.value) {
          inputEmail.classList.remove('has-value');
        }
      });
      inputEmail.addEventListener('input', () => {
        if (inputEmail.value) {
          inputEmail.classList.add('has-value');
        } else {
          inputEmail.classList.remove('has-value');
        }
      });
    }
  }

  configurarLabelFlotante() {
    const selects = this.querySelectorAll('#formVehiculo select');
    selects.forEach((select) => {
      console.log('Select encontrado:', select.id);
      
      select.addEventListener('change', function () {
        console.log('Change en:', this.id, 'valor:', this.value);
        if (this.value) {
          this.classList.add('has-value');
        } else {
          this.classList.remove('has-value');
        }
      });

      select.addEventListener('focus', function () {
        console.log('Focus en:', this.id);
        this.classList.add('has-value');
      });

      select.addEventListener('blur', function () {
        console.log('Blur en:', this.id, 'valor:', this.value);
        if (!this.value) {
          this.classList.remove('has-value');
        }
      });
    });
  }

  cerrarBanner() {
    const banner = this.querySelector('#bannerUsuario');
    banner.classList.remove('abierto');
  }

  /**
   * Cambia el email del usuario.
   * Muestra un formulario para introducir el nuevo email.
   */
  async cambiarEmail(event) {
    // Evitar que se ejecute el comportamiento por defecto del botón
    if (event) event.preventDefault();

    // Obtener elementos del formulario
    const formEmail = this.querySelector('#formEmail');
    const formVehiculo = this.querySelector('#formVehiculo');

    // Si el formulario de email está oculto, mostrarlo
    if (formEmail.style.display === 'none') {
      formEmail.style.display = 'block';
      formVehiculo.style.display = 'none';
    } else {
      formEmail.style.display = 'none';
    }
  }

  /**
   * Envía el formulario de cambio de email.
   */
  async enviarCambioEmail(event) {
    event.preventDefault();

    const nuevoEmail = this.querySelector('#nuevoEmail').value.trim();

    if (!nuevoEmail) {
      alert('El email no puede estar vacío');
      return;
    }

    const rutaBase = obtenerRutaBase();

    try {
      const response = await fetch(rutaBase + 'controllers/CambiarEmailController.php', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: nuevoEmail })
      });

      const data = await response.json();

      if (data.success) {
        alert('Email actualizado correctamente');
        this.querySelector('#formEmail').style.display = 'none';
        this.querySelector('#nuevoEmail').value = '';
      } else {
        alert(data.message || 'Error al cambiar el email');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cambiar el email');
    }
  }

  /**
   * Elimina el vehículo del usuario logueado.
   * Llama al controlador que obtiene el vehículo desde la sesión.
   */
  async borrarVehiculo() {
    // 1. Mostrar confirmación al usuario
    if (!confirm('¿Estás seguro de que quieres borrar tu vehículo?')) {
      return;
    }

    // 2. Obtener la ruta base para construir la URL
    const rutaBase = obtenerRutaBase();

    try {
      // 3. Hacer petición POST al controlador de eliminar vehículo
      const response = await fetch(rutaBase + 'controllers/EliminarVehiculoController.php', {
        method: 'POST',
        credentials: 'include' // Enviar cookies de sesión
      });

      // 4. Convertir respuesta a JSON
      const data = await response.json();

      // 5. Si success es true, mostrar mensaje y recargar página
      if (data.success) {
        alert('Vehículo eliminado correctamente');
        location.reload();
      } else {
        // 6. Si hay error, mostrar mensaje
        alert(data.message || 'Error al eliminar el vehículo');
      }
    } catch (error) {
      // 7. Error de red
      console.error('Error:', error);
      alert('Error al eliminar el vehículo');
    }
  }

  async eliminarCuenta() {
    if (!confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible.')) {
      return;
    }

    // Obtener la ruta base (para construir la URL correcta)
    const rutaBase = obtenerRutaBase();
    console.log('rutaBase:', rutaBase);

    try {
      // Hacer petición POST al controlador PHP
      const url = rutaBase + 'controllers/EliminarCuentaController.php';
      console.log('Fetch URL:', url);
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include' // Enviar cookies de sesión para identificar al usuario
      });
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      // Convertir respuesta a JSON
      const data = await response.json();
      console.log('Data:', data);

      // Si success es true, redirigir al index
      // success es la propiedad que devuelve el controlador PHP
      if (data.success) {
        window.location.href = rutaBase + 'views/index/index.html';
      } else {
        alert('Error al eliminar la cuenta');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar la cuenta');
    }
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
          <h2 data-i18n="perfil.miPerfil">Mi Perfil</h2>
        </div>
        <div class="banner-body">
          <div class="menu-superior">
            <div class="menu-opciones">
              <button class="opcion-btn">Cambiar contraseña</button>
              <button class="opcion-btn">Editar foto de perfil</button>
              <button class="opcion-btn cambiarEmail">Cambiar email</button>
              <button class="opcion-btn">Editar vehículo</button>
              <button class="opcion-btn" id="borrarVehiculo">Borrar vehículo</button>
              <button class="opcion-btn anadirVehiculo">
                Añadir mi vehículo
              </button>
              <button class="opcion-btn verPuntuacion" data-i18n="perfil.verPuntuacion">
              Ver puntuación
              </button>
            </div>
            <form id="formVehiculo" class="form-vehiculo" style="display: none">
              <div class="form-group input-field">
                <select id="tipoVehiculo" name="tipo_vehiculo">
                  <option value=""></option>
                  <option value="turismo" data-i18n="perfil.turismo">Turismo</option>
                  <option value="ranchera" data-i18n="perfil.ranchera">Ranchera</option>
                  <option value="todoterreno" data-i18n="perfil.todoterreno">Todoterreno</option>
                  <option value="monovolumen" data-i18n="perfil.monovolumen">Monovolumen</option>
                  <option value="furgo" data-i18n="perfil.furgo">Furgoneta</option>
                  <option value="otro" data-i18n="perfil.otro">Otro</option>
                </select>
                <label for="tipoVehiculo" data-i18n="perfil.tipoVehiculo">Tipo de vehículo</label>
                <div id="error-tipoVehiculo"></div>
              </div>
              <div class="form-group input-field">
                <select id="tamanoVehiculo" name="tamano">
                  <option value=""></option>
                  <option value="pequeno" data-i18n="perfil.pequeno">Pequeño</option>
                  <option value="mediano" data-i18n="perfil.mediano">Mediano</option>
                  <option value="grande" data-i18n="perfil.grande">Grande</option>
                </select>
                <label for="tamanoVehiculo" data-i18n="perfil.tamano">Tamaño</label>
                <div id="error-tamanoVehiculo"></div>
              </div>
              <button type="submit" class="btn-guardar" data-i18n="perfil.guardar">Guardar</button>
            </form>
            <form id="formEmail" class="form-email" style="display: none">
              <div class="form-group input-field">
                <input type="email" id="nuevoEmail" name="nuevoEmail" placeholder=" ">
                <label for="nuevoEmail">Nuevo email</label>
                <div id="error-nuevoEmail"></div>
              </div>
              <button type="submit" class="btn-guardar">Guardar</button>
            </form>
          </div>
          <div class="menu-inferior">
            <button class="opcion-btn" id="logout">Cerrar sesión</button>
            <button class="opcion-btn danger" id="eliminarCuenta">Eliminar cuenta</button>
          </div>
        </div>
      </aside>`;
  }
}

// Registrar el componente personalizado
customElements.define("perfil-usuario", PerfilUsuario);
