//Autenticación
import { iniciarAuth, obtenerUsuario, cerrarSesion } from '../auth.js';
import "../components/Header.js";
import "../components/PerfilUsuario.js";
import "../components/Modalpuntos.js";
import '../components/Footer.js';
import { cargarTraducciones, aplicarTraducciones, t } from '../translator.js';

//Variable que guarda al usuario (en caso de que exista sesión)
let usuarioActual = null;

//Se ejecuta cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", async function () {
  await cargarTraducciones();
  aplicarTraducciones();
  console.log("Inicializando Login");

  //Inicializa el sistema de autenticación
  await iniciarAuth({
    //Lo que pasa si esta logueado
    alLoguearse: (usuario) => {
      usuarioActual = usuario;
      configurarUIUsuarioLogueado();
      inicializarFormulario();
      inicializarTogglePassword();
    },
    //Usuario no logueado
    alNoLoguearse: () => {
      configurarUIUsuarioNoLogueado();
      inicializarFormulario();
      inicializarTogglePassword();
    }
  });
});

//Función para cuando el usuario está LOGUEADO
function configurarUIUsuarioLogueado() {
  const botonPerfil = document.getElementById('perfilUsuario');
  const banner = document.getElementById('bannerUsuario');
  
  if (botonPerfil && banner) {
    botonPerfil.addEventListener('click', () => {
      banner.classList.toggle('abierto');
    });
  }

  const botonLogout = document.getElementById('logout');
  if (botonLogout) {
    botonLogout.addEventListener('click', () => cerrarSesion());
  }
}

// Toggle mostrar/ocultar contraseña
function inicializarTogglePassword() {
  const toggleButton = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');

  if (toggleButton && passwordInput) {
    toggleButton.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      
      // Cambiar icono
      if (type === 'text') {
        toggleButton.innerHTML = `
          <svg viewBox="0 0 24 24">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          </svg>
        `;
      } else {
        toggleButton.innerHTML = `
          <svg viewBox="0 0 24 24">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        `;
      }
    });
  }
}

//Función cuando el usuario NO ESTÁ LOGUEADO
function configurarUIUsuarioNoLogueado() {
  const botonPerfil = document.getElementById('perfilUsuario');
  if (botonPerfil) {
    botonPerfil.addEventListener('click', () => {
      alert(t('login.yaEnLogin'));
    });
  }
}

//Funcion para validar el formulario
function inicializarFormulario() {
  // Inicializar JustValidate
  const validador = new JustValidate("#loginForm", {
    //Validamos antes de enviar
    validateBeforeSubmitting: true,
    //Enfocamos al primer campo con error
    focusInvalidField: true,
  });

  // Validación EMAIL. Es obligatorio
  validador.addField("#email", [
    {
      rule: "required",
      errorMessage: t('login.errorEmail'),
    },
  ], {
    errorsContainer: "#error-email",
  });

  // Validación CONTRASEÑA
  validador.addField("#password", [
    {
      rule: "required",
      errorMessage: t('login.errorPassword'),
    },
  ], {
    errorsContainer: "#error-password",
  });

  // Cuando el formulario es válido
  validador.onSuccess((event) => {
    event.preventDefault();

    //Recogemos los datos del formulario
    const datos = {
      usuario: document.querySelector("#email").value.trim(),
      contrasena: document.querySelector("#password").value.trim(),
    };

    //Petición mediante Fetch al Backedn PHP para login
    fetch("../../controllers/LoginController.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    })
      .then((response) => response.json())
      .then((data) => {
        //Si todo es correcto
        if (data.status === "ok") {
          alert(data.mensaje);
          //redirigimos a la app principal aparkt
          window.location.href = '../aparkt/aparkt.html';
        //Si el login es incorrrecto
        } else {
          const msjError = data.errores
            ? Object.values(data.errores).join('\n')
            : (data.mensaje || t('login.errorLogin'));
          alert(msjError);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(t('login.errorConexion'));
      });
  });
}

