// Importamos componentes
import '../components/Header.js';
import '../components/PerfilUsuario.js';
import '../components/Footer.js';

// Importamos sistema de autenticación y traducciones
import { iniciarAuth, cerrarSesion } from '../auth.js';
import { cargarTraducciones, aplicarTraducciones, t } from '../translator.js';

//Se ejecuta cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", async function () {

  // Cargamos los textos del idioma seleccionado. IMPORTANTE que sea lo priemro porque si no traemos los idiomas no carga los mensajes en ese idioma
  await cargarTraducciones();

  // Aplicamos traducciones a toda la página (botones, textos, etc.)
  aplicarTraducciones();

  // Mensaje de control para saber que la página ha arrancado bien
  console.log("Inicializando Signup");

  // Inicializamos la lógica principal de la página
  iniciarPagina();

  // Activamos el toggle de mostrar/ocultar contraseña
  inicializarTogglePassword();

  // Inicializamos la validación del formulario
  inicializarFormulario();

});

async function iniciarPagina() {

  // Inicializamos el sistema de autenticación
  await iniciarAuth({

    // Caso: usuario logueado
    alLoguearse: () => {

      // Botón de logout
      const botonLogout = document.getElementById('logout');

      if (botonLogout) {
        botonLogout.addEventListener('click', () => cerrarSesion());
      }

      // Botón de perfil de usuario
      const botonPerfil = document.getElementById('perfilUsuario');

      console.log('signup.js - botonPerfil:', botonPerfil);

      if (botonPerfil) {

        botonPerfil.addEventListener('click', () => {

          console.log('signup.js - click en botonPerfil');

          // Banner de usuario (menú desplegable)
          const banner = document.getElementById('bannerUsuario');

          console.log('signup.js - banner:', banner);

          if (banner) {
            banner.classList.add('abierto');
          }

        });

      }

    },

    // Caso: usuario NO logueado
    alNoLoguearse: () => {
      configurarUIUsuarioNoLogueado();
    }

  });

}

// Usuario NO logueado
// Si no hay sesión, redirigimos al login al pulsar el perfil
function configurarUIUsuarioNoLogueado() {

  const botonPerfil = document.getElementById('perfilUsuario');

  if (botonPerfil) {

    botonPerfil.addEventListener('click', () => {
      window.location.href = "../login/login.html";
    });

  }

}

// Toggle password 
// Permite mostrar u ocultar la contraseña en el input principal
function inicializarTogglePassword() {

  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('inputContrasena');

  if (togglePassword && passwordInput) {

    togglePassword.addEventListener('click', () => {

      // Cambiamos tipo de input entre password y text
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';

      passwordInput.setAttribute('type', type);

      // Cambiamos icono según estado (visible / oculto)
      togglePassword.innerHTML = type === 'text'
        ? `<svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
        : `<svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>`;

    });

  }

  // Toggle contraseña de confirmación
  const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
  const confirmPasswordInput = document.getElementById('confirmarContrasena');

  if (toggleConfirmPassword && confirmPasswordInput) {

    toggleConfirmPassword.addEventListener('click', () => {

      const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';

      confirmPasswordInput.setAttribute('type', type);

      // Cambiamos icono según estado
      toggleConfirmPassword.innerHTML = type === 'text'
        ? `<svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
        : `<svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>`;

    });

  }

}

// Inicializa la validación del formulario
function inicializarFormulario() {

  const form = document.getElementById("formUsuario");

  // Si no existe el formulario, no hacemos nada
  if (!form) return;

  const validador = new JustValidate("#formUsuario", {
    validateBeforeSubmitting: true,
    focusInvalidField: true,
  });

  // VALIDACIÓN NOMBRE
  validador.addField("#inputNombre", [
    { rule: "required", errorMessage: t('signup.errorNombre') },
    { rule: "minLength", value: 2, errorMessage: t('signup.errorNombreMin') },
    { rule: "maxLength", value: 20, errorMessage: t('signup.errorNombreMax') },
    {
      rule: "custom",
      validator: (value) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value),
      errorMessage: t('signup.errorNombreLetras'),
    },
  ], {
    errorsContainer: "#error-nombre",
  });

  // VALIDACIÓN APELLIDOS
  validador.addField("#inputApellidos", [
    { rule: "required", errorMessage: t('signup.errorApellidos') },
    { rule: "minLength", value: 2, errorMessage: t('signup.errorApellidosMin') },
    { rule: "maxLength", value: 50, errorMessage: t('signup.errorApellidosMax') },
    {
      rule: "custom",
      validator: (value) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value),
      errorMessage: t('signup.errorApellidosLetras'),
    },
  ], {
    errorsContainer: "#error-apellidos",
  });

  // VALIDACIÓN EMAIL
  validador.addField("#inputCorreo", [
    { rule: "required", errorMessage: t('signup.errorEmail') },
    { rule: "email", errorMessage: t('signup.errorEmailInvalido') },
  ], {
    errorsContainer: "#error-email",
  });

  // VALIDACIÓN TELÉFONO
  validador.addField("#inputTelefono", [
    {
      rule: "custom",
      validator: (value) => /^\d{9,15}$/.test(value),
      errorMessage: t('signup.errorTelefono'),
    },
  ], {
    errorsContainer: "#error-telefono",
  });

  // VALIDACIÓN CONTRASEÑA
  validador.addField("#inputContrasena", [
    { rule: "required", errorMessage: t('signup.errorPassword') },
    {
      rule: "custom",
      validator: (value) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,15}$/.test(value),
      errorMessage: t('signup.errorPasswordComplejidad'),
    },
  ], {
    errorsContainer: "#error-contrasena",
  });

  // VALIDACIÓN CONFIRMAR CONTRASEÑA
  validador.addField("#confirmarContrasena", [
    { rule: "required", errorMessage: t('signup.errorConfirmar') },
    {
      validator: (value, fields) =>
        value === fields["#inputContrasena"].elem.value,
      errorMessage: t('signup.errorCoincidir'),
    },
  ], {
    errorsContainer: "#error-confirmarContrasena",
  });

  // VALIDACIÓN ACEPTAR TÉRMINOS
  validador.addField("#aceptarTerminos", [
    { rule: "required", errorMessage: t('signup.errorTerminos') },
  ], {
    errorsContainer: "#error-aceptarTerminos",
  });

  // CUANDO EL FORMULARIO ES VÁLIDO
  validador.onSuccess((event) => {

    event.preventDefault();

    // Recogemos datos del formulario
    const datos = {
      nombre: document.getElementById("inputNombre").value.trim(),
      apellido: document.getElementById("inputApellidos").value.trim(),
      ciudad: document.getElementById("inputCiudad").value,
      telefono: document.getElementById("inputTelefono")?.value.trim() || "",
      email: document.getElementById("inputCorreo").value.trim(),
      contrasena: document.getElementById("inputContrasena").value,
      confirmarContrasena: document.getElementById("confirmarContrasena").value,
      aceptarTerminos: document.getElementById("aceptarTerminos").checked,
    };

    // Enviamos datos al backend
    fetch("../../controllers/SignupController.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    })
      .then(res => res.json())
      .then(data => {

        if (data.status === "ok") {
          alert(data.mensaje);
          window.location.href = "../login/login.html";
        } else {
          alert(data.mensaje || t('signup.errorRegistro'));
        }

      })
      .catch(err => {
        console.error(err);
        alert(t('signup.errorConexion'));
      });

  });

}