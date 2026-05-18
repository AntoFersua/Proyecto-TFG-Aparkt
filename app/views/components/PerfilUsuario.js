import { obtenerRutaBase } from '../auth.js';
import './Modalpuntos.js';

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

    // Botón ver puntuación
    const btnPuntuacion = this.querySelector('.verPuntuacion');
    if (btnPuntuacion) {
      btnPuntuacion.addEventListener('click', (e) => {
        e.stopPropagation();
        if (document.querySelector('modal-puntos')) return;
        const modal = document.createElement('modal-puntos');
        document.body.appendChild(modal);
      });
    }

    // Label flotante para selects del formulario de vehículo
    this.configurarLabelFlotante();

    // Drag para bottom sheet en móvil
    this.configurarDrag();

    // Mostrar/ocultar formulario vehículo
    const btnAnadirVehiculo = this.querySelector('.anadirVehiculo');
    const formVehiculo = this.querySelector('#formVehiculo');
    this.vehiculoVisible = false;
    
    if (btnAnadirVehiculo && formVehiculo) {
      btnAnadirVehiculo.addEventListener('click', (e) => {
        e.stopPropagation();
        this.vehiculoVisible = !this.vehiculoVisible;
        if (this.vehiculoVisible) {
          btnAnadirVehiculo.textContent = 'Cancelar';
          formVehiculo.style.display = 'flex';
          formEmail.style.display = 'none';
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

  configurarDrag() {
    const banner = this.querySelector('#bannerUsuario');
    if (!banner) return;

    let startY = 0;
    let currentY = 0;
    let isDragging = false;
    let startTransform = 0;

    const handleStart = (e) => {
      const touch = e.touches ? e.touches[0] : e;
      const rect = banner.getBoundingClientRect();
      
      // Solo permitir drag en los primeros 80px (área de la tira)
      if (touch.clientY < rect.top + 80) {
        startY = touch.clientY;
        isDragging = true;
        currentY = 0;
        startTransform = 0;
        banner.classList.add('dragging');
      }
    };

    const handleMove = (e) => {
      if (!isDragging) return;
      
      const touch = e.touches ? e.touches[0] : e;
      const deltaY = touch.clientY - startY;
      
      // Limitar el movimiento entre 0 (completo) y 85vh (oculto)
      const maxTranslate = window.innerHeight * 0.85;
      currentY = Math.max(0, Math.min(deltaY, maxTranslate));
      
      banner.style.transform = `translateY(${currentY}px)`;
    };

    const handleEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      banner.classList.remove('dragging');
      
      // Si se ha arrastrado más del 40%, ocultar completamente
      const maxTranslate = window.innerHeight * 0.85;
      const threshold = maxTranslate * 0.4;
      
      if (currentY > threshold) {
        this.cerrarBanner();
      } else {
        banner.style.transform = '';
      }
    };

    // Touch events
    banner.addEventListener('touchstart', handleStart, { passive: true });
    banner.addEventListener('touchmove', handleMove, { passive: false });
    banner.addEventListener('touchend', handleEnd);
    
    // Mouse events (para testing en desktop)
    banner.addEventListener('mousedown', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
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
    banner.style.transform = '';
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
      const btnAnadirVehiculo = this.querySelector('.anadirVehiculo');
      if (btnAnadirVehiculo) {
        btnAnadirVehiculo.textContent = 'Añadir mi vehículo';
      }
      this.vehiculoVisible = false;
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
       await window.Swal.fire({ icon: 'warning', title: 'El email no puede estar vacío', timer: 2000, showConfirmButton: false });
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
        await window.Swal.fire({ icon: 'success', title: 'Email actualizado correctamente', timer: 1500, showConfirmButton: false });
        this.querySelector('#formEmail').style.display = 'none';
        this.querySelector('#nuevoEmail').value = '';
      } else {
         await window.Swal.fire({ icon: 'error', title: data.message || 'Error al cambiar el email', timer: 3000, showConfirmButton: false });
      }
    } catch (error) {
      console.error('Error:', error);
      await window.Swal.fire({ icon: 'error', title: 'Error al cambiar el email', timer: 3000, showConfirmButton: false });
    }
  }

  /**
   * Elimina el vehículo del usuario logueado.
   * Llama al controlador que obtiene el vehículo desde la sesión.
   */
  async borrarVehiculo() {
    // 1. Mostrar confirmación al usuario
    const confirmarBorrar = await window.Swal.fire({
      icon: 'warning',
      title: '¿Estás seguro?',
      text: '¿Estás seguro de que quieres borrar tu vehículo?',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    });
    if (!confirmarBorrar.isConfirmed) return;

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
        await window.Swal.fire({ icon: 'success', title: 'Vehículo eliminado correctamente', timer: 1500, showConfirmButton: false });
        location.reload();
      } else {
        // 6. Si hay error, mostrar mensaje
        await window.Swal.fire({ icon: 'error', title: data.message || 'Error al eliminar el vehículo', timer: 3000, showConfirmButton: false });
      }
    } catch (error) {
      // 7. Error de red
      console.error('Error:', error);
      await window.Swal.fire({ icon: 'error', title: 'Error al eliminar el vehículo', timer: 3000, showConfirmButton: false });
    }
  }

   async eliminarCuenta() {
    const confirmarEliminar = await window.Swal.fire({
      icon: 'warning',
      title: '¿Estás seguro?',
      text: '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible.',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!confirmarEliminar.isConfirmed) {
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
         await window.Swal.fire({ icon: 'error', title: 'Error al eliminar la cuenta', timer: 3000, showConfirmButton: false });
      }
    } catch (error) {
      console.error('Error:', error);
      await window.Swal.fire({ icon: 'error', title: 'Error al eliminar la cuenta', timer: 3000, showConfirmButton: false });
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

