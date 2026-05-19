import { obtenerRutaBase, obtenerSesion } from '../auth.js';
import './Modalpuntos.js';

class PerfilUsuario extends HTMLElement {
  constructor() {
    super();
  }

  // Método que se llama cuando el elemento se conecta al DOM.
  connectedCallback() {
    this.render();
    this.configurarEventos();
    this.cargarDatosUsuario();
    this.abrirDesdeHeader = () => this.abrirBanner();
    document.addEventListener('abrirPerfil', this.abrirDesdeHeader);
  }

  disconnectedCallback() {
    if (this.abrirDesdeHeader) {
      document.removeEventListener('abrirPerfil', this.abrirDesdeHeader);
    }
  }

  async cargarDatosUsuario() {
    const nombreEl = this.querySelector("#perfilNombreUsuario");
    const emailEl = this.querySelector("#perfilEmailUsuario");
    if (!nombreEl || !emailEl) return;

    const sesion = await obtenerSesion();
    if (!sesion.logueado) {
      nombreEl.textContent = "Invitado";
      emailEl.textContent = "Inicia sesi\u00f3n para ver tus datos";
      return;
    }

    const usuario = sesion.usuario_datos || {};
    const nombreCompleto = [usuario.nombre, usuario.apellido]
      .filter(Boolean)
      .join(" ")
      .trim();
    const email = usuario.email || sesion.usuario || "";

    nombreEl.textContent = nombreCompleto || "Usuario";
    emailEl.textContent = email;
  }

  configurarEventos() {
    this.colocarFormulariosDebajoDeBotones();

    const btnEliminar = this.querySelector('#eliminarCuenta');
    btnEliminar.addEventListener('click', () => this.eliminarCuenta());

    const btnBorrarVehiculo = this.querySelector('#borrarVehiculo');
    btnBorrarVehiculo.addEventListener('click', () => this.borrarVehiculo());

    this.querySelectorAll('.cambiarEmail').forEach((btnCambiarEmail) => {
      btnCambiarEmail.addEventListener('click', (e) => this.cambiarEmail(e));
    });

    const formEmail = this.querySelector('#formEmail');
    formEmail.addEventListener('submit', (e) => this.enviarCambioEmail.call(this, e));

    const btnCerrar = this.querySelector('#cerrarBanner');
    btnCerrar.addEventListener('click', () => this.cerrarBanner());

    this.querySelectorAll('.cambiarPassword').forEach((btnCambiarPassword) => {
      btnCambiarPassword.addEventListener('click', (e) => this.cambiarPassword(e));
    });

    const formPassword = this.querySelector('#formPassword');
    formPassword.addEventListener('submit', (e) => this.enviarCambioPassword(e));

    const formVehiculo = this.querySelector('#formVehiculo');
    if (formVehiculo) {
      if (typeof window.inicializarValidacionVehiculo === 'function' && typeof window.JustValidate !== 'undefined') {
        window.inicializarValidacionVehiculo();
      } else {
        formVehiculo.addEventListener('submit', (e) => this.enviarVehiculo(e));
      }
    }

    // Botón ver puntuación
    const botonesPuntuacion = this.querySelectorAll('.verPuntuacion');
    botonesPuntuacion.forEach((btnPuntuacion) => {
      btnPuntuacion.addEventListener('click', (e) => {
        e.stopPropagation();
        if (document.querySelector('modal-puntos')) return;
        const modal = document.createElement('modal-puntos');
        document.body.appendChild(modal);
      });
    });

    // Label flotante para selects del formulario de vehículo
    this.configurarLabelFlotante();

    // Drag para bottom sheet en móvil
    this.configurarDrag();

    // Mostrar/ocultar formulario vehículo
    const btnAnadirVehiculo = this.querySelector('.anadirVehiculo');
    this.vehiculoVisible = false;
    
    if (btnAnadirVehiculo && formVehiculo) {
      btnAnadirVehiculo.addEventListener('click', (e) => {
        e.stopPropagation();
        this.vehiculoVisible = !this.vehiculoVisible;
        const btnLabel = btnAnadirVehiculo.querySelector('.opcion-label');
        if (this.vehiculoVisible) {
          this.actualizarTextoBotonVehiculo('Cancelar');
          formVehiculo.style.display = 'flex';
          formEmail.style.display = 'none';
        } else {
          if (btnLabel) {
            btnLabel.textContent = 'Añadir mi vehículo';
          } else {
            btnAnadirVehiculo.textContent = 'Añadir mi vehículo';
          }
          formVehiculo.style.display = 'none';
        }
      });
    }

    const btnCancelarVehiculo = this.querySelector('.btn-cancelar-vehiculo');
    if (btnCancelarVehiculo && btnAnadirVehiculo && formVehiculo) {
      btnCancelarVehiculo.addEventListener('click', (e) => {
        e.stopPropagation();
        this.vehiculoVisible = false;
        const btnLabel = btnAnadirVehiculo.querySelector('.opcion-label');
        if (btnLabel) {
          btnLabel.textContent = 'Añadir mi vehículo';
        } else {
          btnAnadirVehiculo.textContent = 'Añadir mi vehículo';
        }
        formVehiculo.style.display = 'none';
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

  colocarFormulariosDebajoDeBotones() {
    const menuOpciones = this.querySelector('.menu-opciones');
    if (!menuOpciones) return;

    const movimientos = [
      {
        boton: menuOpciones.querySelector('.cambiarPassword'),
        formulario: this.querySelector('#formPassword'),
      },
      {
        boton: menuOpciones.querySelector('.cambiarEmail'),
        formulario: this.querySelector('#formEmail'),
      },
      {
        boton: menuOpciones.querySelector('.anadirVehiculo'),
        formulario: this.querySelector('#formVehiculo'),
      },
    ];

    movimientos.forEach(({ boton, formulario }) => {
      if (!boton || !formulario) return;
      boton.insertAdjacentElement('afterend', formulario);
    });
  }

  actualizarTextoBotonVehiculo(texto) {
    const btnAnadirVehiculo = this.querySelector('.anadirVehiculo');
    if (!btnAnadirVehiculo) return;

    const btnLabel = btnAnadirVehiculo.querySelector('.opcion-label');
    if (btnLabel) {
      btnLabel.textContent = texto;
      return;
    }

    btnAnadirVehiculo.textContent = texto;
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

  abrirBanner() {
    const banner = this.querySelector('#bannerUsuario');
    if (!banner) return;
    banner.style.transform = '';
    banner.classList.add('abierto');
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
        await this.cargarDatosUsuario();
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
  async enviarVehiculo(event) {
    event.preventDefault();

    const tipoVehiculo = this.querySelector('#tipoVehiculo')?.value || '';
    const tamanoVehiculo = this.querySelector('#tamanoVehiculo')?.value || '';

    if (!tipoVehiculo || !tamanoVehiculo) {
      await window.Swal.fire({
        icon: 'warning',
        title: 'Selecciona el tipo y el tamaño del vehículo',
        timer: 2500,
        showConfirmButton: false
      });
      return;
    }

    const rutaBase = obtenerRutaBase();

    try {
      const response = await fetch(rutaBase + 'controllers/VehiculoController.php', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipoVehiculo,
          tamano: tamanoVehiculo,
        })
      });

      const data = await response.json();

      if (data.status === 'ok' || data.success) {
        await window.Swal.fire({
          icon: 'success',
          title: data.mensaje || 'Vehículo registrado correctamente',
          timer: 1500,
          showConfirmButton: false
        });
        this.querySelector('#formVehiculo').reset();
        this.querySelector('#formVehiculo').style.display = 'none';
        this.vehiculoVisible = false;
        this.actualizarTextoBotonVehiculo('Añadir mi vehículo');
      } else if (data.errores) {
        await window.Swal.fire({
          icon: 'error',
          title: Object.values(data.errores).join('\n'),
          timer: 3000,
          showConfirmButton: false
        });
      } else {
        await window.Swal.fire({
          icon: 'error',
          title: data.mensaje || data.message || 'Error al registrar vehículo',
          timer: 3000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error:', error);
      await window.Swal.fire({
        icon: 'error',
        title: 'Error al registrar vehículo',
        timer: 3000,
        showConfirmButton: false
      });
    }
  }

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

   async cambiarPassword(event) {
  if (event) event.preventDefault();

  const formPassword = this.querySelector('#formPassword');
  const formVehiculo = this.querySelector('#formVehiculo');

  if (formPassword.style.display === 'none') {
    formPassword.style.display = 'block';
    formVehiculo.style.display = 'none';
    const formEmail = this.querySelector('#formEmail');
    formEmail.style.display = 'none';
    const btnAnadirVehiculo = this.querySelector('.anadirVehiculo');
    if (btnAnadirVehiculo) {
      btnAnadirVehiculo.textContent = 'Añadir mi vehículo';
    }
    this.vehiculoVisible = false;
  } else {
    formPassword.style.display = 'none';
  }
}

async enviarCambioPassword(event) {
  event.preventDefault();

  const passwordActual = this.querySelector('#passwordActual').value.trim();
  const passwordNueva = this.querySelector('#passwordNueva').value.trim();

  if (!passwordActual || !passwordNueva) {
    await window.Swal.fire({ icon: 'warning', title: 'Todos los campos son obligatorios', timer: 2000, showConfirmButton: false });
    return;
  }

  const passPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,15}$/;
  if (!passPattern.test(passwordNueva)) {
    await window.Swal.fire({ icon: 'warning', title: 'Mínimo 6 y máximo 15 caracteres, al menos una mayúscula, una minúscula, un número y un símbolo (@!?%)', timer: 3000, showConfirmButton: false });
    return;
  }

  const rutaBase = obtenerRutaBase();

  try {
    const response = await fetch(rutaBase + 'controllers/CambiarPasswordController.php', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passwordActual, passwordNueva })
    });

    const data = await response.json();

    if (data.success) {
      await window.Swal.fire({ icon: 'success', title: 'Contraseña actualizada correctamente', timer: 1500, showConfirmButton: false });
      this.querySelector('#formPassword').style.display = 'none';
      this.querySelector('#passwordActual').value = '';
      this.querySelector('#passwordNueva').value = '';
    } else {
      await window.Swal.fire({ icon: 'error', title: data.message || 'Error al cambiar la contraseña', timer: 3000, showConfirmButton: false });
    }
  } catch (error) {
    console.error('Error:', error);
    await window.Swal.fire({ icon: 'error', title: 'Error al cambiar la contraseña', timer: 3000, showConfirmButton: false });
  }
}

  //Aquí pintamos el HTML del modal PerfilUsuario
  render() {
    this.innerHTML = `
           <aside id="bannerUsuario" class="banner-lateral">
        <div class="perfil-container">
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
        <div class="banner-header perfil-header">
          <h2 class="perfil-titulo" data-i18n="perfil.miPerfil">Mi Perfil</h2>
          <div class="perfil-resumen perfil-usuario">
            <div class="perfil-avatar" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4z"/>
              </svg>
            </div>
            <div class="perfil-identidad">
              <strong id="perfilNombreUsuario" class="perfil-nombre">Usuario</strong>
              <span id="perfilEmailUsuario" class="perfil-email">Cargando...</span>
            </div>
            <button type="button" class="perfil-edit-btn cambiarEmail">Editar perfil</button>
          </div>
        </div>
        <div class="banner-body">
          <div class="menu-superior">
            <div class="menu-opciones perfil-opciones">
              <button class="opcion-btn cambiarPassword">
                <svg class="opcion-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                <span class="opcion-label">Cambiar contraseña</span>
              </button>
              <button class="opcion-btn">
                <svg class="opcion-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
                <span class="opcion-label">Editar foto de perfil</span>
              </button>
              <button class="opcion-btn cambiarEmail">
                <svg class="opcion-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span class="opcion-label">Cambiar email</span>
              </button>
              <button class="opcion-btn">
                <svg class="opcion-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
                <span class="opcion-label">Editar vehículo</span>
              </button>
              <button class="opcion-btn" id="borrarVehiculo">
                <svg class="opcion-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
                <span class="opcion-label">Borrar vehículo</span>
              </button>
              <button class="opcion-btn anadirVehiculo">
                <svg class="opcion-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span class="opcion-label">Añadir mi vehículo</span>
              </button>
              <button class="opcion-btn verPuntuacion" data-i18n="perfil.verPuntuacion">
                <svg class="opcion-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span class="opcion-label">Ver puntuación</span>
              </button>
            </div>
            <form id="formVehiculo" class="form-vehiculo" style="display: none">
              <h3 class="form-titulo">Añadir vehículo</h3>
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
              <div class="form-botones">
                <button type="button" class="btn-cancelar btn-cancelar-vehiculo">Cancelar</button>
                <button type="submit" class="btn-guardar" data-i18n="perfil.guardar">Guardar</button>
              </div>
            </form>
            <form id="formEmail" class="form-email" style="display: none">
              <h3 class="form-titulo">Cambiar email</h3>
              <div class="form-group input-field">
                <input type="email" id="nuevoEmail" name="nuevoEmail" placeholder=" ">
                <label for="nuevoEmail">Nuevo email</label>
                <div id="error-nuevoEmail"></div>
              </div>
              <div class="form-botones">
                <button type="button" class="btn-cancelar cambiarEmail">Cancelar</button>
                <button type="submit" class="btn-guardar">Guardar</button>
              </div>
            </form>
            <form id="formPassword" class="form-password" style="display: none">
                <h3 class="form-titulo">Cambiar contraseña</h3>
                <div class="form-group input-field">
                  <input type="password" id="passwordActual" name="passwordActual" placeholder=" ">
                  <label for="passwordActual">Contraseña actual</label>
                  <div id="error-passwordActual"></div>
                </div>

                <div class="form-group input-field">
                  <input type="password" id="passwordNueva" name="passwordNueva" placeholder=" ">
                  <label for="passwordNueva">Nueva contraseña</label>
                  <div id="error-passwordNueva"></div>
                </div>
                <div class="form-botones">
                  <button type="button" class="btn-cancelar cambiarPassword">Cancelar</button>
                  <button type="submit" class="btn-guardar">Guardar</button>
                </div>
            </form>
          </div>
          <div class="menu-inferior perfil-opciones perfil-opciones-peligro">
            <button class="opcion-btn" id="logout">
              <svg class="opcion-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span class="opcion-label">Cerrar sesión</span>
            </button>
            <button class="opcion-btn danger" id="eliminarCuenta">
              <svg class="opcion-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              <span class="opcion-label">Eliminar cuenta</span>
            </button>
          </div>
        </div>
        </div>
      </aside>`;
  }
}

// Registrar el componente personalizado
customElements.define("perfil-usuario", PerfilUsuario);

