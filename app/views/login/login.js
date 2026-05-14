//Autenticación
import { iniciarAuth, obtenerUsuario, cerrarSesion } from '../auth.js';
import "../components/Header.js";
import "../components/PerfilUsuario.js";
import "../components/Modalpuntos.js";
import '../components/Footer.js';
import { cargarTraducciones, aplicarTraducciones, t } from '../translator.js';

//Guardamos el usuario actual si existe sesión iniciada
let usuarioActual = null;

//Se ejecuta cuando el DOM ya está cargado completamente (la página ya existe en pantalla)
document.addEventListener("DOMContentLoaded", async function () {

  //Cargamos el sistema de traducciones antes de pintar nada
  await cargarTraducciones();

  //Aplicamos el idioma seleccionado al HTML. IMPORTANTE que sea lo priemro porque si no traemos los idiomas no carga los mensajes en ese idioma
  aplicarTraducciones();

  console.log("Inicializando Login");

  //Inicializa el sistema de autenticación (comprueba si hay sesión o no)
  await iniciarAuth({

    //CASO 1: el usuario está logueado
    alLoguearse: (usuario) => {

      //Guardamos el usuario en memoria
      usuarioActual = usuario;

      //Configuramos la interfaz cuando hay sesión activa
      configurarUIUsuarioLogueado();

      //Inicializamos validación del formulario de login
      inicializarFormulario();

      //Activamos el botón de mostrar/ocultar contraseña
      inicializarTogglePassword();
    },

    //CASO 2: el usuario NO está logueado
    alNoLoguearse: () => {

      //Configuramos la interfaz para usuario sin sesión
      configurarUIUsuarioNoLogueado();

      //Inicializamos validación del formulario igualmente
      inicializarFormulario();

      //Activamos el toggle de contraseña igualmente
      inicializarTogglePassword();
    }
  });
});

//Función que configura la UI cuando el usuario ya está logueado
function configurarUIUsuarioLogueado() {

  //Botón de perfil del usuario
  const botonPerfil = document.getElementById('perfilUsuario');

  //Banner desplegable del usuario
  const banner = document.getElementById('bannerUsuario');
  
  //Si existen los elementos, activamos comportamiento del perfil
  if (botonPerfil && banner) {
    botonPerfil.addEventListener('click', () => {
      banner.style.transform = '';
      //Abrimos/cerramos el banner del usuario
      banner.classList.toggle('abierto');
    });
  }

  //Botón de logout (cerrar sesión)
  const botonLogout = document.getElementById('logout');

  if (botonLogout) {

    //Al hacer click, cerramos sesión
    botonLogout.addEventListener('click', () => cerrarSesion());
  }
}

//Función para mostrar/ocultar contraseña en el input
function inicializarTogglePassword() {

  const toggleButton = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');

  //Solo si existen los dos elementos
  if (toggleButton && passwordInput) {

    toggleButton.addEventListener('click', () => {

      //Si está en password lo pasamos a text y viceversa
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';

      passwordInput.setAttribute('type', type);
      
      //Cambiamos el icono según el estado del input
      if (type === 'text') {
        toggleButton.innerHTML = `
          <svg viewBox="0 0 24 24">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
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

//Función cuando el usuario NO está logueado
function configurarUIUsuarioNoLogueado() {

  const botonPerfil = document.getElementById('perfilUsuario');

  //Si existe el botón de perfil
  if (botonPerfil) {

    botonPerfil.addEventListener('click', () => {

      //Mostramos mensaje o redirigimos según el idioma actual
      alert(t('login.yaEnLogin'));
    });
  }
}

//Función que inicializa la validación del formulario de login
function inicializarFormulario() {

  //Inicializamos la librería de validación JustValidate
  const validador = new JustValidate("#loginForm", {

    //Valida antes de enviar el formulario
    validateBeforeSubmitting: true,

    //Enfoca automáticamente el primer error encontrado
    focusInvalidField: true,
  });

  //VALIDACIÓN DEL EMAIL (obligatorio)
  validador.addField("#email", [
    {
      rule: "required",
      errorMessage: t('login.errorEmail'),
    },
  ], {
    errorsContainer: "#error-email",
  });

  //VALIDACIÓN DE CONTRASEÑA (obligatoria)
  validador.addField("#password", [
    {
      rule: "required",
      errorMessage: t('login.errorPassword'),
    },
  ], {
    errorsContainer: "#error-password",
  });

  //Cuando el formulario es válido y pasa todas las validaciones
  validador.onSuccess((event) => {

    event.preventDefault();

    //Recogemos datos del formulario
    const datos = {
      usuario: document.querySelector("#email").value.trim(),
      contrasena: document.querySelector("#password").value.trim(),
    };

    //Enviamos los datos al backend PHP para hacer login
    fetch("../../controllers/LoginController.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    })
      .then((response) => response.json())
      .then((data) => {

        //Si el login es correcto
        if (data.status === "ok") {
          alert(data.mensaje);

          //Redirigimos a la app principal
          window.location.href = '../aparkt/aparkt.html';

        //Si el login falla
        } else {
          const msjError = data.errores
            ? Object.values(data.errores).join('\n')
            : (data.mensaje || t('login.errorLogin'));
          alert(msjError);
        }
      })
      .catch((error) => {

        //Error de conexión con el backend
        console.error("Error:", error);
        alert(t('login.errorConexion'));
      });
  });
}