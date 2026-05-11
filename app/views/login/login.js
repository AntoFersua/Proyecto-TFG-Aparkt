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
    },
    //Usuario no logueado
    alNoLoguearse: () => {
      configurarUIUsuarioNoLogueado();
      inicializarFormulario();
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
          alert(t('login.errorLogin'));
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(t('login.errorConexion'));
      });
  });
}

